import React from 'react';
import dotenv from 'dotenv';
import './css/App.css';
import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';
import Profile from './views/Profile';
import EditProfile from './views/EditProfile';
import Navbar from './components/Navbar';
// import IsLoggedIn from './components/IsLoggedIn';
import NotFound404 from './NotFound404';
import Error from './views/Error';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import axios from 'axios';

function App() {
  dotenv.config();

  // let Status = axios.get("/statuslogin", { withCredentials: true })
  //   .then((res) => {
  //     console.log(res.data.loggedin)
  //     return res.data.loggedin ? true : false;
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })

  // const isLoggedIn = () => {
  //   fullname = localStorage.getItem('fullname');

  //   if (fullname.length > 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }



  return (

    <Router>
      <div className="App">
        {window.location.pathname === "/" || window.location.pathname === "/signup" || window.location.pathname === "" ? null : <Navbar />}
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/home" component={Home} />

          <Route path="/error" component={Error} />
          <Route path="/myprofile" component={Profile} />
          <Route path="/edit" component={EditProfile} />
          <Route component={NotFound404} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
