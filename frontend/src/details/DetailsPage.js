import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import { withRouter } from 'react-router'

const DetailsPage = props => {
  const [tableName, setTableName] = useState('')
  useEffect(() => {
    loadTableInformation()
    // eslint-disable-next-line
  }, [])

  const loadTableInformation = async () => {
    const { tableName } = props.match.params
    if (tableName) {
      setTableName(tableName)
    }
  }

  return (
    <Row>
      <Col sm={24}>
        This is the Details page
        <div>{tableName}</div>
      </Col>
    </Row>
  )
}

export default withRouter(DetailsPage)
