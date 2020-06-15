import React, { useEffect, useState } from 'react'
import { Row, Col, Divider, message } from 'antd'

// HOC
import { withRouter } from 'react-router'

// Components
import QuerySquare from './components/QuerySquare'
import Message from './components/Message'
import DynamicTable2 from './components/DynamicTable2'
import SaveQueryModal from './components/SaveQueryModal'
import { fetchSavedQueries, fetchQuery, fetchExportExcel } from '../../config/Api'
import CopyToClipboardFromTableBody from "./components/CopyToClipboardFromTableBody";

const QueryPage = props => {
  const [recordsets, setRecordsets] = useState([])
  const [loading, setLoading] = useState(false)
  const [showingMessage, setShowingMessage] = useState(false)
  const [rowsAffected, SetRowsAffected] = useState([[]])
  const [isOpenSaveQueryModal, setIsOpenSaveQueryModal] = useState(false)
  const [saveQueryLoading, setSaveQueryLoading] = useState(false)

  const { savedQueryToUse } = props
  useEffect(() => {
    // eslint-disable-next-line
  }, [savedQueryToUse])


  const checkRecordSets = queryResults => {
    return (
      queryResults &&
      Array.isArray(queryResults.recordset) &&
      queryResults.recordset.length
    )
  }

  const checkRowsAffected = queryResults => {
    return (
      queryResults &&
      queryResults &&
      queryResults.rowsAffected &&
      Array.isArray(queryResults.rowsAffected) &&
      queryResults.rowsAffected.length
    )
  }

  const executeQuery = async (query) => {
    setLoading(true)
    let queryResult
    try {
      queryResult = await fetchQuery(query)

      if(typeof(queryResult) !== 'object'){
        message.warning(queryResult)
        return
      }

      if (!checkRecordSets(queryResult)) {
        setRecordsets([])
      } else {
        setShowingMessage(false)
        let json = JSON.stringify(queryResult.recordset, (k, v) => v && typeof v === 'object' ? v : '' + (v === '' ? '-' :v));
        setRecordsets(JSON.parse(json))
      }

      // Set rowsAffected
      if (!checkRowsAffected(queryResult)) {
        SetRowsAffected([])
        setShowingMessage(false)
      } else {
        setShowingMessage(true)
        SetRowsAffected(queryResult.rowsAffected[0])
      }
    } catch (e) {
      message.error('Error')
      setShowingMessage(false)
      setRecordsets([])
    } finally {
      setLoading(false)
    }
  }

  const saveQuery = async query => {
    console.log('Saving query:', query)
    setSaveQueryLoading(true)
    try {
      // eslint-disable-next-line
      const savedQueries = await fetchSavedQueries()

    } catch (e) {
      message.error('Error saving the query')
    } finally {
      setIsOpenSaveQueryModal(false)
      setSaveQueryLoading(false)
    }
  }

  const exportExcel = async (query) => {
    setLoading(true)
    if(query !== ""){
      let queryResult = await fetchExportExcel(query)
      setLoading(false)
      if(typeof(queryResult) === 'object'){
        window.open(queryResult.link);
      }else{
       message.warning(queryResult)
      }
    }
  }

  const copyToClipBoard = () => {
    let tableToCopy = document.querySelector('.dynamic-table-2 .ant-table .ant-table-container .ant-table-content table')
    if(tableToCopy === null ) return message.error('There is no data to copy')
    CopyToClipboardFromTableBody(tableToCopy)
  }

  return (
    <Row className='query-page'>
      <SaveQueryModal
        visible={isOpenSaveQueryModal}
        handleCloseModal={() => setIsOpenSaveQueryModal(false)}
        handleSaveQuery={saveQuery}
        loading={saveQueryLoading}
      />
      {showingMessage ? (
        <>{Message.success(`Rows Affected: ${rowsAffected}`)}</>
      ) : null}

      <Col sm={24} style={{ marginTop: '10px' }}>
        <QuerySquare loading={loading} handleQuery={executeQuery} handlerExcel={exportExcel} handleToCopy={copyToClipBoard} querySaved={savedQueryToUse}/>
      </Col>
      <Divider style={{ backgroundColor: 'lightgray' }} />

      <Col sm={24}>
        <DynamicTable2 recordsets={recordsets} />
      </Col>
    </Row>
  )
}

QueryPage.defaultProps = {
  savedQueryToUse: '',
}

export default withRouter(QueryPage)
