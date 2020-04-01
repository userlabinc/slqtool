import React from 'react'
import {Link} from "react-router-dom";

const NavBar = () => {
  return <nav className="flex-nav">
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/query">Query</Link>
      </li>
    </ul>
  </nav>
}

export default NavBar
