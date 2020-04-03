//Libs
import React, { useState } from 'react'
import { Button, Card, Form, Input } from 'antd'

const LoginIndex = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleChangeUsername = ({ target }) => {
    const { value } = target
    setUserName(value)
  }

  const handleChangePassword = ({ target }) => {
    const { value } = target
    setPassword(value)
  }

  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: 'lightgray',
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <div style={{ margin: '50px' }}>
        <Card className='login-card'>
          <Input
            placeholder='Username'
            value={userName}
            onChange={handleChangeUsername}
          />
          <Input
            placeholder='Username'
            value={password}
            onChange={handleChangePassword}
            style={{ marginTop: '10px' }}
          />
          <div style={{ marginTop: '10px' }}>
            <Button
              type='primary'
              style={{ borderRadius: '20px', width: '100%' }}
            >
              Log In
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginIndex
