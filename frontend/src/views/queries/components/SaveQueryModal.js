import React, { useState } from 'react'
import { Button, Input, Modal } from 'antd'

const SaveQueryModal = props => {
  const [queryName, setQueryName] = useState('')

  const handleInputName = ({ target }) => {
    const { value } = target
    setQueryName(value)
  }

  const saveQuery = () => {
    console.log('Inner saveQuery')
    props.handleSaveQuery(queryName)
  }

  return (
    <Modal
      title='Save Query'
      visible={props.visible}
      footer={[
        <Button key='back' onClick={props.handleCloseModal}>
          Return
        </Button>,
        <Button
          key='submit'
          type='primary'
          loading={props.loading}
          onClick={saveQuery}
        >
          Submit
        </Button>,
      ]}
    >
      <Input value={queryName} onChange={handleInputName} />
    </Modal>
  )
}

SaveQueryModal.defaultProps = {
  visible: false,
  loading: false,
  handleSaveQuery: () => {},
  handleCloseModal: () => {},
}

export default SaveQueryModal
