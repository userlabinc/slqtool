import React from 'react'
import {Switch, Route, Redirect, withRouter, Link} from 'react-router-dom'
import QueryPage from "./views/queries/QueryPage";
import Home from "./views/home";
import NavBar from "./components/NavBar";

const Router =()=>{
  return <div>
    <header className="flex-header">
      Moocho Database
    </header>
    <main className="flex-main">
      <NavBar/>
      <article className="flex-article">
        <Switch>
          <Route path="/query">
            <QueryPage />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </article>
    </main>
    <footer className="flex-footer">
      Moocho { new Date().getFullYear()}
    </footer>
  </div>
}

export default Router
