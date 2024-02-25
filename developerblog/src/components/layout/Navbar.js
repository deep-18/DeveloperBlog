import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {logout} from '../../actions/auth'
import { NavLink, Route } from 'react-router-dom/cjs/react-router-dom.min';

const Navbar = ({logout,auth: {isAuthenticated,loading}}) => {
  const authLinks = (
    <ul>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/posts">Posts</Link></li>
      <li><a to="!#" onClick={logout}> Logout </a></li>
      {/* <li><Link to="!#">Developers</Link></li> */}
      {/* <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li> */}
    </ul>
  )
  const guestLinks = (
    <ul>
      <li><Link to="!#">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  )
  return(
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/"><i className="fas fa-code"></i> DevTalks</Link>
        </h1>
        { !loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
      </nav>
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps,{logout})(Navbar);