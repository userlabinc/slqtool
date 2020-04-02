import React, { useState } from 'react'
import { message, Row, Col } from 'antd'
import QuerySquare from './components/QuerySquare'
import DinamicTable from '../../components/DinamicTable'
import ExecuteQueryButton from './components/ExecuteQueryButton'
import Message from './components/Message'

const QueryPage = () => {
  const [query, setQuery] = useState('select * from users where id=2')
  const [recordsets, setRecordsets] = useState([])
  const [loading, setLoading] = useState(false)
  const [showingMessage, setShowingMessage] = useState(false)
  const [showingErrorMessage, setShowingErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [rowsAffected, SetRowsAffected] = useState([[]])

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
      console.log('QR: ', queryResult)

      // Set recordset
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
      // console.log(queryResult)
      console.error('Error: ', e)
      setShowingMessage(false)
      setErrorMessage(true)
      setErrorMessage(e)
      setRecordsets([])
    } finally {
      setLoading(false)
    }
  }

  const fetchQuery = async query => {
    const headers = { 'content-type': 'application/json' }
    const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT, {
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
        {showingErrorMessage ? (
          <>{Message.error(`Error: ${errorMessage}`)}</>
        ) : null}
      <Col sm={24} style={{ border: '1px solid red' }}>
        <QuerySquare loading={loading} query={query} setQuery={setQuery} />
      </Col>
      <Col sm={12}>
        <ExecuteQueryButton
          loading={loading}
          onClick={executeQuery}
          value={loading ? 'Loading...' : 'Execute'}
        />
      </Col>

      <DinamicTable recordsets={recordsets} />
    </Row>
  )
}

export default QueryPage
