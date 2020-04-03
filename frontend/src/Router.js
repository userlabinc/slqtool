import React, { useEffect, useState } from 'react'
import { Layout, Menu, Tree } from 'antd'
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
  const { TreeNode } = Tree

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
      setTreeData(
        response.map((element, index) => ({
          title: element,
          key: `tree-${index}`,
          rootNode: true,
        }))
      )
      console.log(response)
    } catch (error) {
      console.error('Error loading tables: ', error)
    }
  }

  const onLoadData = treeNode =>
    new Promise(async resolve => {
      if (treeNode.props.children || !treeNode.props.rootNode) {
        resolve()
        return
      }
      try {
        const columns = await fetchTableColumns(treeNode.props.title)
        console.log('columns:', columns)
        treeNode.props.dataRef.children = columns.map(
          (column, columnIndex) => ({
            title: column,
            key: `T-${treeNode.props.title}-C-${columnIndex}`,
          })
        )
        setTreeData([...treeData])
        resolve()
      } catch (error) {
        console.error('Error fetching the columns')
      }
    })

  const renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />
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
              <Tree loadData={onLoadData}>{renderTreeNodes(treeData)}</Tree>
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
