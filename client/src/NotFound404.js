import React from 'react';
import './css/App.css';
import './css/custom.scss';
import { Link } from 'react-router-dom';


function NotFound404() {
  return (
    <div className="pt-5 general p-4 error-page">
      <div className=" mt-5 p-5 " >
        <div className=" " style={{ color: "black", fontSize: "50px" }}>

          <h1 style={{ fontFamily: "monospace" }}> ERROR 404!</h1>
          <h3>Oops that page doesn't exist!!!</h3>
          <h3>The devs seem to have missed their deadline!</h3>
          <Link to="/home"><button className="btn login-submit btn-dark rounded-pill mt-1"> Go Home</button></Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound404;
