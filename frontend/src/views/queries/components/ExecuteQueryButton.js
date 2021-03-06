import React from 'react'
import { Button } from 'antd'

const ExecuteQueryButton = props => {
  return (
    <Button disabled={props.loading} onClick={props.onClick} >
      {props.value}
    </Button>
  )
}

ExecuteQueryButton.defaultProps = {
  onClick: () => {},
}

export default ExecuteQueryButton
