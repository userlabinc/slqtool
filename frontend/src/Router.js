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

    //eslint-disable-next-line
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
      setTablesList(
        response.map((element, index) => ({
          title: element,
          key: index,
          children: [],
        }))
      )
      console.log(response)
    } catch (e) {}
  }

  const fetchTableColumns = async tableName => {
    const { REACT_APP_BACKEND_DETAIL_ENDPOINT } = configJson
    console.log('Inside fetchTables function')

    const headers = { 'content-type': 'application/json' }
    const backendRoute = REACT_APP_BACKEND_DETAIL_ENDPOINT + tableName
    console.log(backendRoute)
    const response = await fetch(backendRoute, {
      method: 'get',
      headers,
    })

    return response.json()
  }

  const loadColumnsInformation = async tableIndex => {
    try {
      const columns = await fetchTableColumns(tablesList[tableIndex].title)
      console.log('Columns:', columns)
      setTablesList(prevState => {
        let tables = [...prevState]
        tables[tableIndex].children = columns
        return tables
      })
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
                  <SubMenu
                    key={`ssub_menu_${index}`}
                    children={[
                      <Menu.Item>
                        <span>Testing</span>
                      </Menu.Item>,
                    ]}
                    title={
                      <span onClick={() => loadColumnsInformation(element.key)}>
                        <UserOutlined />
                        <span>{element.title}</span>
                      </span>
                    }
                  >
                    {element.children.length &&
                      element.children.map((tableColumn, tableColumnIndex) => (
                        <Menu.Item key={`T${index}-C${tableColumn}`}>
                          <span>{tableColumn}</span>
                        </Menu.Item>
                      ))}
                  </SubMenu>
                ))}
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
            Userlab - {new Date().getFullYear()} - SQL Tool<span>V - {process.env.REACT_APP_VERSION}</span>
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default Router
