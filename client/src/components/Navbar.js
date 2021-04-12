import React, { useState, useEffect } from 'react'
import '../css/App.css';
import '../css/Navbar.css';
import '../css/custom.scss';
import { Link } from 'react-router-dom';
import Search from './Search';

function Navbar() {


    const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark" ? true : false);
    useEffect(() => {
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", localStorage.getItem("theme"));
    }, []);

    const toggleThemeChange = () => {
        if (isDark === false) {
            localStorage.setItem("theme", "dark");
            document
                .getElementsByTagName("HTML")[0]
                .setAttribute("data-theme", localStorage.getItem("theme"));
            setIsDark(true);
        } else {
            localStorage.setItem("theme", "light");
            document
                .getElementsByTagName("HTML")[0]
                .setAttribute("data-theme", localStorage.getItem("theme"));
            setIsDark(false);
        }
    }

    return (
        <nav className="navbar sticky-top  navbar-nav-scroll navbar-dark navbarbg text">
            <div className="container-fluid ">
                <Link className="text nav-logo" to="/home">TwitClone</Link>

                <Search />

                <div className="d-flex nav-links ">
                    <input type="checkbox" class="toggle" onClick={toggleThemeChange} />

                </div>

            </div>


        </nav >
    );
}

export default Navbar;
