import React, { useEffect, useState } from 'react'
import {Row, Col, Divider, message, Button, Spin} from 'antd'

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
  const [recordsets2, setRecordsets2] = useState([])
  const [loading, setLoading] = useState(false)
  const [showingMessage, setShowingMessage] = useState(false)
  const [rowsAffected, SetRowsAffected] = useState([[]])
  const [isOpenSaveQueryModal, setIsOpenSaveQueryModal] = useState(false)
  const [saveQueryLoading, setSaveQueryLoading] = useState(false)

  const [nextHandler,setNextHandler] = useState(1)
  const [nextQueryHandler,setNextQueryHandler] = useState("")

  const numberOfRows = 1000

  const { savedQueryToUse } = props
  useEffect(() => {
    // eslint-disable-next-line
  }, [savedQueryToUse])

  const checkRecordSets = queryResults => {
    return (
      queryResults &&
      Array.isArray(queryResults.recordsets) &&
      queryResults.recordsets.length
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

  const executeQuery = async (query,pageNumber) => {
    setRecordsets([])
    setRecordsets2([])
    setLoading(true)
    let queryResult
    try {

      if (pageNumber === 1){
        setNextHandler(1)
      }

      let queryObject ={query:query,pageNumber:pageNumber}
      queryResult = await fetchQuery(queryObject)

      if(typeof(queryResult) !== 'object'){
        message.warning(queryResult)
        return
      }

      if (!checkRecordSets(queryResult)) {
        setRecordsets([])
      } else {

        if(queryResult.recordsets.length === 2){
          setShowingMessage(false)
          let json = JSON.stringify(queryResult.recordsets[0], (k, v) => v && typeof v === 'object' ? v : '' + (v === '' ? '-' :v));
          let json2 = JSON.stringify(queryResult.recordsets[1], (k, v) => v && typeof v === 'object' ? v : '' + (v === '' ? '-' :v));
          setRecordsets(JSON.parse(json))
          setRecordsets2(JSON.parse(json2))
        }else{
          setShowingMessage(false)
          let json = JSON.stringify(queryResult.recordsets[0], (k, v) => v && typeof v === 'object' ? v : '' + (v === '' ? '-' :v));
          setRecordsets(JSON.parse(json))
        }

      }

      // Set rowsAffected
      if (!checkRowsAffected(queryResult)) {
        SetRowsAffected([])
        setShowingMessage(false)
      } else {
        setShowingMessage(true)
        SetRowsAffected(queryResult.rowsAffected[0])
      }
      setNextQueryHandler(query)
    } catch (e) {
      message.error('Error')
      setShowingMessage(false)
      setRecordsets([])
    } finally {
      setLoading(false)
    }
  }

  const executeQueryNext = () => {
    let page = nextHandler+1
    setNextHandler(page)
    executeQuery(nextQueryHandler,page)

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
      let queryObject ={query:query}
      let queryResult = await fetchExportExcel(queryObject)
      setLoading(false)
      if(typeof(queryResult) === 'object'){
        window.open(queryResult.link);
      }else{
       message.warning(queryResult)
      }
    }
  }

  const copyToClipBoard = () => {
    let tableToCopy = document.querySelectorAll('.dynamic-table-2 .ant-table .ant-table-container .ant-table-content table')
    if(tableToCopy === null ) return message.error('There is no data to copy')
    CopyToClipboardFromTableBody(tableToCopy)
  }

  const pageNumber = (rows) => {
    let number = rows / numberOfRows;
    return number.toString().split('.')[1] ?
      Math.trunc(number) + 1 :
      Math.round((number))
  }

  return (
    <Spin spinning={loading} tip="Waiting for results...">
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
      {recordsets.length > 0 && (
        <Col className={'hidden-element'} sm={24} style={{textAlign:'right',marginBottom:'5px'}}>
          <span style={{marginRight:'10px'}}>
            {!(rowsAffected >= numberOfRows) ?
              '1/1':
              `${nextHandler}/${pageNumber(rowsAffected)}`
            }
          </span>
          <Button
            className={'hidden-element'}
            disabled={!(rowsAffected >= numberOfRows) || (nextHandler === pageNumber(rowsAffected))}
            onClick={executeQueryNext}>
            NEXT PAGE</Button>
        </Col>
      )}
      {recordsets2 ? (
        <>
        <Col sm={24}>
          <DynamicTable2 recordsets={recordsets} />
        </Col>
          <Divider style={{ backgroundColor: 'lightgray' }} />
        <Col sm={24}>
        <DynamicTable2 recordsets={recordsets2} />
        </Col>
        </>
      ):(
        <Col sm={24}>
          <DynamicTable2 recordsets={recordsets} />
        </Col>
      )}
    </Row>
    </Spin>
  )
}

QueryPage.defaultProps = {
  savedQueryToUse: '',
}

export default withRouter(QueryPage)
