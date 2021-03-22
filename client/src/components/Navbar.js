import React from 'react';
import '../css/App.css';
import '../css/Navbar.css';
import '../css/custom.scss';
import { Link } from 'react-router-dom';
import Search from './Search';

function Navbar() {

    return (
        <nav class="navbar sticky-top  navbar-nav-scroll navbar-dark bg-dark text">
            <div class="container-fluid ">
                <Link class="text nav-logo" to="/home">TwitClone</Link>

                <Search />

                <div class="d-flex nav-links ">
                    <Link class="nav-link text"></Link>
                </div>

            </div>


        </nav >
    );
}

export default Navbar;
