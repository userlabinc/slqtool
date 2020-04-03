import React, { useEffect, useState } from 'react'
import { Row, Col, Divider, message, Button } from 'antd'

// HOC
import { withRouter } from 'react-router'

// Components
import QuerySquare from './components/QuerySquare'
import ExecuteQueryButton from './components/ExecuteQueryButton'
import Message from './components/Message'
import DynamicTable2 from './components/DynamicTable2'
import configJson from '../../config/config.json'
import CustomVerticalDivider from './components/CustomVerticalDivider'

const QueryPage = props => {
  const [query, setQuery] = useState('')
  const [recordsets, setRecordsets] = useState([])
  const [loading, setLoading] = useState(false)
  const [showingMessage, setShowingMessage] = useState(false)
  const [rowsAffected, SetRowsAffected] = useState([[]])

  const { inline_query } = props.match.params
  useEffect(() => {
    loadInlineQuery()
    // eslint-disable-next-line
  }, [inline_query])

  const loadInlineQuery = () => {
    if (inline_query) {
      setQuery(inline_query)
    }
  }

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

  const executeQuery = async () => {
    setLoading(true)
    let queryResult

    try {
      queryResult = await fetchQuery(query)

      if (!checkRecordSets(queryResult)) {
        setRecordsets([])
      } else {
        setShowingMessage(false)
        setRecordsets(queryResult.recordset)
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

  const fetchQuery = async query => {
    const headers = { 'content-type': 'application/json' }
    const response = await fetch(configJson.REACT_APP_BACKEND_ENDPOINT, {
      method: 'post',
      headers,
      body: JSON.stringify({ query }),
    })

    return response.json()
  }

  return (
    <Row className='query-page'>
      {showingMessage ? (
        <>{Message.success(`Rows Affected: ${rowsAffected}`)}</>
      ) : null}

      <Col sm={24} style={{ marginTop: '10px' }}>
        <QuerySquare loading={loading} query={query} setQuery={setQuery} />
      </Col>
      <Divider style={{ backgroundColor: 'lightgray' }} />
      <Col sm={24} style={{ display: 'flex', justifyContent: 'center' }}>
        <Button disabled={loading}>Export to Excel</Button>
        <CustomVerticalDivider />
        <Button disabled={loading}>Save Query</Button>
        <CustomVerticalDivider />
        <ExecuteQueryButton
          loading={loading}
          onClick={executeQuery}
          value={loading ? 'Loading...' : 'Execute'}
        />
      </Col>
      <Divider style={{ backgroundColor: 'lightgray' }} />

      <Col sm={24}>
        <DynamicTable2 recordsets={recordsets} />
      </Col>
    </Row>
  )
}

export default withRouter(QueryPage)
