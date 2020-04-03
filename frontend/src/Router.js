import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { DesktopOutlined, UserOutlined } from '@ant-design/icons'
import { Switch, Route, Link } from 'react-router-dom'
import QueryPage from './views/queries/QueryPage'
import DetailsPage from './details/DetailsPage'
import { fetchTables, fetchTableColumns } from './config/Api'

const Router = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [tablesList, setTablesList] = useState([])

  const { SubMenu } = Menu
  const { Content, Footer, Sider } = Layout

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

  useEffect(() => {
    loadTablesInformation()

    //eslint-disable-next-line
  }, [])

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
    } catch (error) {
      console.error('Error loading tables: ', error)
    }
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
    } catch (error) {
      console.error('Error loading columns: ', error)
    }
  }

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          width={200}
        >
          <div className='logo' />
          <Menu
            mode='inline'
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu
              key='submenu_query'
              title={
                <span>
                  <UserOutlined />
                  <span>Query</span>
                </span>
              }
            >
              <Menu.Item key='1'>
                <DesktopOutlined />
                <Link to='/'>Query</Link>
              </Menu.Item>
            </SubMenu>

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
          <Content style={{ margin: '0 16px' }}>
            <div
              className='site-layout-background'
              style={{ padding: 24, minHeight: 360 }}
            >
              <Switch>
                <Route path='/details/:tableName?'>
                  <DetailsPage />
                </Route>
                <Route path='/'>
                  <QueryPage />
                </Route>
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Userlab - {new Date().getFullYear()} - SQL Tool
            <span>V.0.0.1</span>
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default Router
