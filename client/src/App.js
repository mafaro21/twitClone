import React from 'react';
import './css/App.css';
import Footer from './Footer';
import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';
import Header from './Header';
import NotFound404 from './NotFound404';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/home" component={Home} />
          <Route component={NotFound404} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
