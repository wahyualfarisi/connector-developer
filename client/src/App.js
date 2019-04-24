import React from 'react';
import {BrowserRouter as Router , Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

//static
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import setAuthToken from './utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { setCurrentUser, setLogout } from './actions/authActions';


//check token
if(localStorage.jwtToken){
  //set auth token
  setAuthToken(localStorage.jwtToken);

  //decode token
  const decode = jwt_decode(localStorage.jwtToken)

  //set current user
  store.dispatch(setCurrentUser(decode));

  //check for expired token
  const currentTime = Date.now() / 1000;
  if(decode.exp < currentTime){
    //logout user
    store.dispatch(setLogout());

    //redirect to login
    window.location.href = '/login';

  }

}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact={true} path="/" component={ Landing } title={'HEllo'} />
            <div className="container" >
              <Route exact path="/register" component={ Register }  />
              <Route exact path="/login" component={ Login } />
            </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
