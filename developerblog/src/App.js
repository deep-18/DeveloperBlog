import React,{Fragment, useEffect} from 'react'
import './App.css';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/alert';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import addExperience from './components/profile-forms/AddExperience';
import addEducation from './components/profile-forms/AddEducation';
import PrivateRoute from './components/dashboard/routing/privateroute';
import Post from './components/posts/Post';
import PostS from './components/post/Post';
//Redux
import { Provider } from 'react-redux';
import store from './store'
import {loadUser} from './actions/auth'
import setAuthToken from './utils/setAuthToken'

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  },[])
  return(
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          {/* <Landing /> */}
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert /> 
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-profile" component={CreateProfile} />
              <PrivateRoute exact path="/edit-profile" component={EditProfile} />
              <PrivateRoute exact path="/add-experience" component={addExperience} />
              <PrivateRoute exact path="/add-education" component={addEducation} />
              <PrivateRoute exact path="/posts" component={Post} />
              <PrivateRoute exact path="/:id" component={PostS} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;
