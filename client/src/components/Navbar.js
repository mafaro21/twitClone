import React from 'react';
import '../css/App.css';
import '../css/Navbar.css';
import '../css/custom.scss';
import { Link } from 'react-router-dom';
import Search from './Search';

function Navbar() {

    return (
        <nav className="navbar sticky-top  navbar-nav-scroll navbar-dark bg-dark text">
            <div className="container-fluid ">
                <Link className="text nav-logo" to="/home">TwitClone</Link>

                <Search />

                <div className="d-flex nav-links ">
                </div>

            </div>


        </nav >
    );
}

export default Navbar;
