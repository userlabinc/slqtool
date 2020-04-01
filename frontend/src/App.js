import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import { createBrowserHistory } from 'history'
import Home from "./views/home";

import QueryPage from './views/queries/QueryPage'
import AppRouter from './Router'

const history = createBrowserHistory()

export default function App() {
    return (
      <Router history={history}>
        <Switch>
          <Route render={props => <AppRouter {...props} />} />
        </Switch>
      </Router>
    );
}





