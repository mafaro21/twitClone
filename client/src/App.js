import React, { useState, useMemo, useEffect, useContext } from 'react'
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
import NotFound404 from './NotFound404';
import Following from './views/Following'
import Followers from './views/Followers'
import SearchResults from './views/SearchResults'
import Error from './views/Error';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserContext } from './Contexts/UserContext';
import { ApiContext } from './Contexts/ApiContext';
import { ToFollowContext } from './Contexts/ToFollowContext';
import axios from 'axios';

function App() {
  dotenv.config();

  const [user, setUser] = useState("")

  const value = useMemo(() => [user, setUser], [user, setUser])

  const [apiData, setApiData] = useState({ articles: [] })

  const api = useMemo(() => [apiData, setApiData], [apiData, setApiData])

  const [toFollow, setToFollow] = useState({ data: [] })

  const UsersToFollow = useMemo(() => [toFollow, setToFollow], [toFollow, setToFollow])

  useEffect(() => {
    if (localStorage.length === 0) {
      //if a user doesn't have any theme or accent preset in their localstorage
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

    // const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    // scheme.addEventListener('change', (e) => {
    //   // console.log(e.matches)

    //   if (e.matches) {
    //     localStorage.setItem("theme", "dark");
    //   } else {
    //     localStorage.setItem("theme", "light");
    //   }
    // });

    axios.get("extras/top3users")
      .then((res) => {
        console.log(res.data);
        setToFollow(res);
      })
      .catch((err) => {
        console.error(err);
      });

    const options = {
      method: "GET",
      url: "https://newsapi.org/v2/top-headlines",
      params: {
        category: "entertainment",
        pageSize: 8,
        country: "us",
        apiKey: process.env.REACT_APP_NEWS_API_KEY
      }
    };

    axios.request(options)
      .then(function (res) {
        // console.log("news api ran")
        setApiData(res.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);




  return (

    <Router>
      <div className="App general">

        <UserContext.Provider value={value}>
          <ApiContext.Provider value={api}>
            <ToFollowContext.Provider value={UsersToFollow}>
              <Switch>

                <Route path="/" exact component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/home" component={Home} />
                <Route path="/explore" component={Explore} />
                <Route path="/more" component={More} />
                <Route path="/search" component={SearchResults} />

                <Route path="/u/:username" exact >
                  <Profile />
                </Route>
                <Route path="/u/:username/edit" exact >
                  <EditProfile />
                </Route>
                <Route path="/post/:postid" exact>
                  <Post />
                </Route>

                <Route path="/u/:username/following" component={Following} />
                <Route path="/u/:username/followers" component={Followers} />

                <Route path="/compose/tweet" component={Compose} />
                <Route path="/error" component={Error} />

                <Route component={NotFound404} />
              </Switch>
            </ToFollowContext.Provider>
          </ApiContext.Provider>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
