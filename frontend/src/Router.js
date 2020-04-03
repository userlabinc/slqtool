import React, { useEffect, useState } from 'react'
import { Layout, Menu, message, Tree } from 'antd'
import { ToolOutlined, LayoutOutlined } from '@ant-design/icons'
import { Switch, Route, Link } from 'react-router-dom'
import QueryPage from './views/queries/QueryPage'
import DetailsPage from './details/DetailsPage'
import { fetchTables, fetchTableColumns } from './config/Api'

const Router = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [treeData, setTreeData] = useState([])

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
    try {
      const response = await fetchTables()
      setTreeData(
        response.map((element, index) => ({
          title: element,
          key: `tree-${index}`,
          rootNode: true,
        }))
      )
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

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          width={350}
        >
          <div className='logo' />
          <Menu
            mode='inline'
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key='1'>
              <ToolOutlined />
              <Link to='/'>Query</Link>
            </Menu.Item>
            <SubMenu
              key='2'
              title={
                <div>
                  <LayoutOutlined />
                  <span>Tables</span>
                </div>
              }
            >
              <Tree loadData={onLoadData2} treeData={treeData} />
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
            <span>Userlab - {new Date().getFullYear()} - SQL Tool</span>
            <span> </span>
            <span>V {process.env.REACT_APP_VERSION}</span>
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default Router
