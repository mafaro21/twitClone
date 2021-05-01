import React, { useState, useMemo, useEffect } from 'react'
import dotenv from 'dotenv';
import './css/App.css';
import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';
import Explore from './views/Explore';
import Profile from './views/Profile';
import EditProfile from './views/EditProfile';
import Post from './views/Post'
import Compose from './views/Compose'
import More from './views/More'
import IsLoggedIn from './components/IsLoggedIn';
import NotFound404 from './NotFound404';
import Following from './views/Following'
import Followers from './views/Followers'
import Error from './views/Error';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './Contexts/UserContext';
import { ThemeContext } from './Contexts/ThemeContext';


function App() {
  dotenv.config();

  useEffect(() => {
    if (localStorage.length === 0) {
      localStorage.setItem("theme", "medium");
      localStorage.setItem("accent", "rgba(29,161,242,1.00)");
    }

    document
      .getElementsByTagName("HTML")[0]
      .setAttribute("data-theme", localStorage.getItem("theme"));
    // document.setAttribute("accent-theme", localStorage.getItem("accent"));

    document
      .getElementsByTagName("HTML")[0]
      .setAttribute("accent-theme", localStorage.getItem("accent"));



  }, []);

  const [user, setUser] = useState('')

  const value = useMemo(() => [user, setUser], [user, setUser])

  const [theme, setTheme] = useState("medium")

  // const usernameData = useMemo(() => [username, setUsername], [username, setUsername])

  return (

    <Router>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className="App general" data-theme={theme}>

          <UserContext.Provider value={value}>
            <Switch>

              <Route path="/" exact component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/home" component={Home} data-theme={theme} />
              <Route path="/explore" component={Explore} />
              <Route path="/more" component={More} />

              <Route path="/u/:user" exact >
                <Profile />
              </Route>
              <Route path="/u/:user/edit" exact >
                <EditProfile />
              </Route>
              <Route path="/post/:postid" exact>
                <Post />
              </Route>

              <Route path="/u/:user/following" component={Following} />
              <Route path="/u/:user/followers" component={Followers} />

              <Route path="/compose/tweet" component={Compose} />
              <Route path="/error" component={Error} />

              <Route component={NotFound404} />
            </Switch>
            {/* <Sidebar /> */}
          </UserContext.Provider>
        </div>
      </ThemeContext.Provider>
    </Router>
  );
}

export default App;
