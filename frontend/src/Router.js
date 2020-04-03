import React, { useEffect, useState } from 'react'
import { Layout, Menu, Tree } from 'antd'
import { DesktopOutlined, UserOutlined } from '@ant-design/icons'
import { Switch, Route, Link } from 'react-router-dom'
import QueryPage from './views/queries/QueryPage'
import DetailsPage from './details/DetailsPage'
import { fetchTables, fetchTableColumns } from './config/Api'

const Router = () => {
  const [collapsed, setCollapsed] = useState(false)
  // eslint-disable-next-line
  const [tablesList, setTablesList] = useState([])
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
      setTablesList(
        response.map((element, index) => ({
          title: element,
          key: index,
          children: [],
        }))
      )
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

      // setTimeout(() => {
      //   treeNode.props.dataRef.children = [
      //     { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
      //     { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
      //   ]
      //   setTreeData([...treeData])
      //   resolve()
      // }, 100)
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
            <SubMenu title='Tree'>
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
            Userlab - {new Date().getFullYear()} - SQL Tool
            <span>V {process.env.REACT_APP_VERSION}</span>
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default Router
