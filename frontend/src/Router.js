import React, { useEffect, useState } from 'react'
import { Layout, Menu, Drawer, message, Tree } from 'antd'
import { ToolOutlined, LayoutOutlined } from '@ant-design/icons'
import { Switch, Route, Link } from 'react-router-dom'

import menu_routes from './config/Menu_routes'

// HOC
import { withRouter } from 'react-router'

// Components
import QueryPage from './views/queries/QueryPage'
import DetailsPage from './details/DetailsPage'
import { fetchTables, fetchTableColumns, fetchSavedQueries } from './config/Api'
import LoginIndex from './views/login/LoginIndex'

const Router = props => {
  const [collapsed, setCollapsed] = useState(false)
  const [treeData, setTreeData] = useState([])
  // eslint-disable-next-line
  const [login, setLogin] = useState(true)
  const [savedQueriesDrawerIsOpen, setSavedQueriesDrawerIsOpen] = useState(
    false
  )

  const [savedQueries, setSavedQueries] = useState([])
  const [savedQueryToUse, setSavedQueryToUse] = useState('')

  const { SubMenu } = Menu
  const { Content, Footer, Sider } = Layout

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

  useEffect(() => {
    loadTablesInformation()

    //eslint-disable-next-line
  }, [])

  let returnAttribues = option => {
    switch (option) {
      case 'query':
        return <>
          <ToolOutlined />
          <span>
            <Link to='/'>Query</Link>
          </span>
        </>
      case 'savedQueries':
        return <>
          <ToolOutlined />
          <span onClick={() => handleOpenSavedQueriesDrawer()}>
                  Saved Queries
                </span>
        </>
      default:
        return <></>
    }
  }

  const loadTablesInformation = async () => {
    try {
      const response = await fetchTables()
      setTreeData(
        response.map((element, index) => ({
          title: element,
          key: `tree-${index}`,
          rootNode: true,
        }))
      )

      const savedQueries = await fetchSavedQueries()
      setSavedQueries(savedQueries.queries)
    } catch (error) {
      message.error('Error loading tables: ')
    }
  }

  const onLoadData2 = treeNode => {
    return new Promise(async resolve => {
      const treeNodeIndex = treeData.findIndex(
        element => element.key === treeNode.key
      )
      if (
        treeData[treeNodeIndex].children ||
        !treeData[treeNodeIndex].rootNode
      ) {
        resolve()
        return
      }
      try {
        const columns = await fetchTableColumns(treeData[treeNodeIndex].title)
        const newChildren = columns.map((column, columnIndex) => ({
          title: column,
          key: `T-${treeData[treeNodeIndex]}-C-${columnIndex}`,
        }))

        setTreeData(prevTree => {
          let tmpTree = [...prevTree]
          tmpTree.splice(treeNodeIndex, 1, {
            ...treeNode,
            children: newChildren,
          })
          return tmpTree
        })
        resolve()
      } catch (error) {
        message.error('Error fetching the columns')
      }
    })
  }

  const handleOpenSavedQueriesDrawer = () => {
    setSavedQueriesDrawerIsOpen(true)
  }

  const goToSavedQuery = query => {
    return () => {
      setSavedQueryToUse(query)
    }
  }

  return (
    <div>
      <Drawer
        title='Saved Queries'
        visible={savedQueriesDrawerIsOpen}
        onClose={() => setSavedQueriesDrawerIsOpen(false)}
      >
        {savedQueries.length &&
          savedQueries.map((element, index) => (
            <div
              key={index}
              style={{ cursor: 'pointer', marginTop: '15px' }}
              onClick={goToSavedQuery(element.query)}
            >
              {element.name}
            </div>
          ))}
      </Drawer>

      {!login ? (
        <Route component={LoginIndex} />
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            width={250}
          >
            <div className='logo' />
            <Menu
              mode='inline'
              defaultSelectedKeys={['query']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >

              {menu_routes && menu_routes.length > 0
                && menu_routes.map( (option) =>
                  option.key !== 'tables' ?
                  (<Menu.Item key={option.key}>
                      {returnAttribues(option.icon)}
                  </Menu.Item>):(
                      <SubMenu
                        key='tables'
                        title={
                          <div>
                            <LayoutOutlined />
                            <span>Tables</span>
                          </div>
                        }
                      >
                        <Tree loadData={onLoadData2} treeData={treeData} />
                      </SubMenu>
                    )
                 )
              }
            </Menu>
          </Sider>
          <Layout className='site-layout'>
            <Content style={{ margin: '0 16px' }}>
              <div
                className='site-layout-background'
                style={{ padding: 24, minHeight: 360 }}
              >
                <Switch>

                  {/*{menu_routes.map((r, i) => (*/}
                  {/*  <Route exact key={i} path={r.route} component={r.component} />*/}
                  {/*))}*/}

                  <Route path='/details/:tableName?'>
                    <DetailsPage />
                  </Route>
                  <Route path='/:inline_query?'>
                    <QueryPage savedQueryToUse={savedQueryToUse} />
                  </Route>
                </Switch>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              <span>Userlab - {new Date().getFullYear()} - SQL Tool</span>
              <span> </span>
              <span>V {process.env.REACT_APP_VERSION}</span>
            </Footer>
          </Layout>
        </Layout>
      )}
    </div>
  )
}

export default withRouter(Router)
