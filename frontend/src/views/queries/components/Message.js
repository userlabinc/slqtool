import React from 'react'

const messageTypes = {
  SUCCESS: 'SUCCESS',
  DANGER: 'DANGER'
}

const messageColorType = {
  [messageTypes.SUCCESS]: 'lightgreen',
  [messageTypes.DANGER]: 'red'
}

const Message = props => {
  return <div style={{backgroundColor: messageColorType[props.type]}}>
    {props.value}
  </div>
}


Message.defaultProps = {
  type: messageColorType.SUCCESS,
  value: ''
}


export  default  {
  success: (message) => <Message type={messageTypes.SUCCESS} value={message}/>,
  error: (message) => <Message type={messageTypes.DANGER} value={message}/>
}
