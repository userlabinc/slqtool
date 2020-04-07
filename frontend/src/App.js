import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import AppRouter from './Router'

import Amplify from 'aws-amplify'
import awsconfig from './aws-exports'
import '@aws-amplify/ui/dist/style.css'
import { withAuthenticator } from 'aws-amplify-react'
Amplify.configure(awsconfig)

const history = createBrowserHistory()

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route render={props => <AppRouter {...props} />} />
      </Switch>
    </Router>
  )
}
export default withAuthenticator(App, true)
