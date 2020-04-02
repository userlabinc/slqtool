import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import AppRouter from './Router'

const history = createBrowserHistory()

export default function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route render={props => <AppRouter {...props} />} />
      </Switch>
    </Router>
  )
}
