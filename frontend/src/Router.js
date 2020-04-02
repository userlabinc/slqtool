import React, { useState } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import QueryPage from './views/queries/QueryPage'
import Home from './views/home'

import { Layout, Menu } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons'

const Router = () => {
  const { SubMenu } = Menu
  const { Header, Content, Footer, Sider } = Layout

  const [collapsed, setCollapsed] = useState(false)
  const onCollapse = collapsed => {
    console.log(collapsed)
    setCollapsed(collapsed)
  }

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className='logo' />
          <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
            <Menu.Item key='1'>
              <PieChartOutlined />
              <Link to='/'>Home</Link>
            </Menu.Item>
            <Menu.Item key='2'>
              <DesktopOutlined />
              <Link to='/query'>Query</Link>
            </Menu.Item>
            <SubMenu
              key='sub1'
              title={
                <span>
                  <UserOutlined />
                  <span>Tables</span>
                </span>
              }
            >
              <Menu.Item key='3'>Tom</Menu.Item>
              <Menu.Item key='4'>Bill</Menu.Item>
              <Menu.Item key='5'>Alex</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className='site-layout'>
          <Header className='site-layout-background' style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div
              className='site-layout-background'
              style={{ padding: 24, minHeight: 360 }}
            >
              <Switch>
                <Route path='/query'>
                  <QueryPage />
                </Route>
                <Route path='/'>
                  <Home />
                </Route>
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Moocho {new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default Router
