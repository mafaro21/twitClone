import React, { useState } from 'react'
import dotenv from 'dotenv';
import './css/App.css';
import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';
import Profile from './views/Profile';
import EditProfile from './views/EditProfile';
import Navbar from './components/Navbar';
import Post from './views/Post'
import Compose from './views/Compose'
// import IsLoggedIn from './components/IsLoggedIn';
import NotFound404 from './NotFound404';
import Error from './views/Error';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import { TweetContext } from './components/TweetContext'

function App() {
  dotenv.config();

  // const [tweetContext, setTweetContext] = useState(null)

  return (

    <Router>
      <div className="App">
        {window.location.pathname === "/" || window.location.pathname === "/signup" || window.location.pathname === "" ? null : <Navbar />}

        <Switch>

          <Route path="/" exact component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/home" component={Home} />
          <Route path="/error" component={Error} />
          {/* <TweetContext.Provider> */}
          <Route path="/u/:user" exact >
            <Profile />
          </Route>
          {/* </TweetContext.Provider > */}
          <Route path="/u/:user/edit" exact >
            <EditProfile />
          </Route>
          {/* <Route path="/edit" component={EditProfile} /> */}
          <Route path="/post" component={Post} />
          <Route path="/compose/tweet" component={Compose} />



          <Route exact component={NotFound404} />


        </Switch>
      </div>
    </Router>
  );
}

export default App;
