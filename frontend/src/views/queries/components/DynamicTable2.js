import React from 'react'
import { Table } from 'antd'

const DynamicTable2 = props => {
  const CUSTOM_KEY = 'moocho_index'

  const getColumns = () => {
    if (!props.recordsets.length) {
      return null
    }

    const firstRecordKeys = Object.keys(props.recordsets[0])
    const columns = []

    firstRecordKeys.forEach(element => {
      if (element !== CUSTOM_KEY) {
        columns.push({ title: element, dataIndex: element, key: element })
      }
    })

    return columns
  }

  const getDataSource = () => {
    // const dataSource = []
    // const rowValues = Object.values()
    return props.recordsets.map((element, index) => {
      element[CUSTOM_KEY] = index
      return element
    })
  }

  const renderTable = () => {
    // console.log('Render table function')
    if (
      !getColumns() ||
      !getColumns().length ||
      !getDataSource() ||
      !getDataSource().length
    ) {
      // console.log('Returning')
      return null
    }

    return (
      <React.Fragment>
        <Table
          columns={getColumns()}
          dataSource={getDataSource()}
          rowKey={CUSTOM_KEY}
        />
      </React.Fragment>
    )
  }

  return <>{renderTable()}</>
}

DynamicTable2.defaultProps = {
  recordsets: [],
}

export default DynamicTable2
