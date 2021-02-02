import React from 'react';
import './css/App.css';
import Footer from './components/Footer';
import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';
import Header from './components/Header';
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
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
