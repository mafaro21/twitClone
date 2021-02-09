import React from 'react';
import './css/App.css';
import './css/Header.css';
import './css/custom.scss';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav class="navbar sticky-top  navbar-dark bg-secondary text">
            <div class="container-fluid ">
                <Link class="navbar-brand" to="/home">TwitClone</Link>

                <form className="d-flex">
                    <input class="search-input " type="search" placeholder="Search TwitClone..." aria-label="Search" />
                    <button class="btn btn-outline-primary" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </button>
                </form>

                <div class=" d-flex ">
                    <Link class="nav-link text" to="/signup">signup</Link>
                    <Link class="nav-link text" to="/">login</Link>
                    <Link class="nav-link text" to="#">Logout</Link>
                </div>
            </div>


        </nav >
    );
}

export default Navbar;
