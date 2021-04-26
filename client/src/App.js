import React from 'react'
import dotenv from 'dotenv';
import './css/App.css';
import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';
import Profile from './views/Profile';
import EditProfile from './views/EditProfile';
import Post from './views/Post'
import Compose from './views/Compose'
import IsLoggedIn from './components/IsLoggedIn';
import NotFound404 from './NotFound404';
import Following from './views/Following'
import Followers from './views/Followers'
import Error from './views/Error';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
// import { TweetContext } from './components/TweetContext'


function App() {
  dotenv.config();

  return (

    <Router>
      <div className="App general">


        <Switch>


          <Route path="/" exact component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/home" component={Home} />

          <Route path="/u/:user" exact >
            <div>
              <Profile />
            </div>
          </Route>
          <Route path="/u/:user/edit" exact >
            <EditProfile />
          </Route>
          <Route path="/post/:postid" exact>
            <Post />
          </Route>

          <Route path="/u/:user/following" component={Following} />
          <Route path="/u/:user/followers" component={Followers} />

          {/* component={Post} /> */}
          <Route path="/compose/tweet" component={Compose} />

          <Route path="/error" component={Error} />
          <Route component={NotFound404} />

        </Switch>
        {/* <Sidebar /> */}

      </div>
    </Router>
  );
}

export default App;
