import React, { useEffect, useState } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import QueryPage from './views/queries/QueryPage'
import Home from './views/home'
import configJson from './config'

import { Layout, Menu } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons'
import DetailsPage from './details/DetailsPage'

const Router = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [tablesList, setTablesList] = useState([])

  const { SubMenu } = Menu
  const { Header, Content, Footer, Sider } = Layout

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

  useEffect(() => {
    loadTablesInformation()
  }, [])

  const fetchTables = async () => {
    console.log('Inside fetchTables function')

    const headers = { 'content-type': 'application/json' }
    const response = await fetch(configJson.REACT_APP_BACKEND_LIST_ENDPOINT, {
      method: 'get',
      headers,
    })

    return response.json()
  }

  const loadTablesInformation = async () => {
    console.log('Inside load tables information')
    try {
      const response = await fetchTables()
      setTablesList(response)
      console.log(response)
    } catch (e) {}
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
              {tablesList.length &&
                tablesList.map((element, index) => (
                  <Menu.Item key={index}>
                    <Link to={`/details/${element}`}>{element}</Link>
                  </Menu.Item>
                ))}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className='site-layout'>
          <Header className='site-layout-background' style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div>V.1.0</div>
            <div
              className='site-layout-background'
              style={{ padding: 24, minHeight: 360 }}
            >
              <Switch>
                <Route path='/query'>
                  <QueryPage />
                </Route>
                <Route path='/details/:tableName?'>
                  <DetailsPage />
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
