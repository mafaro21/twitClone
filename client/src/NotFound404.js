import React from 'react';
import './css/App.css';
import { Link } from 'react-router-dom';

/* 404 error page, make this page even better!! get creative. */

const NotFound404 = () => (
  <div>
    <h1>404 - Not Found!</h1>
    <Link to="/"><button> Go Home</button></Link>
  </div>
);

export default NotFound404;