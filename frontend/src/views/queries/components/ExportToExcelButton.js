import React from 'react'
import { Button } from 'antd'

const ExportToExcelButton = props => {
  return (
    <Button disabled={props.loading} onClick={props.onClick} type={'primary'}>
      {props.value}
    </Button>
  )
}

ExportToExcelButton.defaultProps = {
  onClick: () => {},
}

export default ExportToExcelButton
