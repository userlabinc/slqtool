import configJson from './config'

export const fetchTableColumns = async tableName => {
  const { REACT_APP_BACKEND_DETAIL_ENDPOINT } = configJson
  const url = REACT_APP_BACKEND_DETAIL_ENDPOINT + tableName
  return fetchGet(url)
}

export const fetchSavedQueries = async () => {
  const { REACT_APP_SAVE_QUERIES } = configJson
  return fetchGet(REACT_APP_SAVE_QUERIES)
}

export const fetchTables = async tableName => {
  const { REACT_APP_BACKEND_LIST_ENDPOINT } = configJson
  return fetchGet(REACT_APP_BACKEND_LIST_ENDPOINT)
}

export const fetchQuery = async queryObject => {
  const { REACT_APP_BACKEND_ENDPOINT } = configJson
  return fetchPost(REACT_APP_BACKEND_ENDPOINT, queryObject)
}

const fetchGet = async url => {
  const headers = { 'content-type': 'application/json' }
  const options = { method: 'get', headers }

  const response = await fetch(url, options)

  if (!response) {
    throw new Error('There is no response')
  }

  return response.json()
}

const fetchPost = async (url, postObject) => {
  const headers = { 'content-type': 'application/json' }
  const options = { method: 'post', headers, body: JSON.stringify(postObject) }

  const response = await fetch(url, options)
  return response.json()
}
