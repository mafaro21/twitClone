import React from 'react';
import '../css/App.css';
import '../css/custom.scss';
import { Link } from 'react-router-dom';

export default function Error() {
    return (
        <div className="pt-5 general p-4 error-page">
            <div className="row mt-5 d-flex p-5 " >
                <div className="col " style={{ color: "black" }}>
                    <h1 style={{ fontFamily: "monospace" }}>500 ERROR!</h1>
                    <h3 style={{ fontFamily: "monospace" }}>Oops! Something broke on our server!</h3>
                    <h3 style={{ fontFamily: "monospace" }}>Try again in a little bit!</h3>
                    <Link to="/home"><button className="btn login-submit btn-outline-primary rounded-pill mt-1"> Go Home</button></Link>
                </div>
                <div className="col " >
                </div>
            </div>
        </div>
    );
}