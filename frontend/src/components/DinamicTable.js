import React from 'react'

const DinamicTable = (props) => {

  const renderHeader = () => {
    if (!props.recordsets.length) {
      return null
    }

    const firstRecordKeys = Object.keys(props.recordsets[0])
    return(<thead>
    <tr>
      {firstRecordKeys.map((element, index) => <th
        key={`h-${index}`}>{element}</th>)}
    </tr>
    </thead>)
  }


  const renderBody = () => {
    return <tbody>
    {props.recordsets.map((outerElement, outerIndex) => <tr key={`tr-${outerIndex}`}>
      {renderCell(outerElement, outerIndex)}
    </tr>)}

    </tbody>
  }

  const renderCell = (rowElement, rowIndex) => {
    const rowValues = Object.values(rowElement)

    return rowValues.map((cellElement, cellIndex) => {
      const tdKey = `td-${rowIndex}-${cellIndex}`

      return <td key={tdKey}>{cellElement}</td>
    })
  }

  return (
    <table className="dinamic-table">
      {renderHeader()}
      {renderBody()}
    </table>
  )

}

export default DinamicTable
