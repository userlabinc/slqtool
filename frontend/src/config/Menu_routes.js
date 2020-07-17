import TableSearchIndex from '../views/tableSearch/tableSearchIndex'

const menu_routes =[
  {
    name: 'Query',
    key: 'query',
    icon: 'query',
    route: '/',
    component: null,
  },
  {
    name: 'Saved Queries',
    key: 'savedQueries',
    icon: 'savedQueries',
    route: null,
    component: null,
  },
  {
    name: 'Tables',
    key: 'tables',
    icon: 'tables',
    route: null,
    component: null,
  },
  {
    name: 'Table Search',
    key: 'tableSearch',
    icon: 'tableSearch',
    route: null,
    component: TableSearchIndex,
  },
]

export default menu_routes
