import React from 'react';
import {Route,Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const privateroute = ({ component: Component,auth: {isAuthenticated,loading}, ...rest}) => (
    <Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to='/login' />) : (<Component {...props} />)  }/>
)

privateroute.propTypes = {
    auth: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps)(privateroute)
