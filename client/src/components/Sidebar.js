import React, { useState, useEffect, useRef, useContext } from 'react';
import '../css/Sidebar.css';
import '../css/custom.scss';
import axios from "axios";
import Loader from "react-loader-spinner";
import { Link, useLocation } from 'react-router-dom';
import Search from './Search';
import { UserContext } from '../Contexts/UserContext';


function Sidebar() {
    const [user] = useContext(UserContext)

    const [api, setApi] = useState({ articles: [] });

    const [loading, setLoading] = useState(false)

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const newsRef = useRef(false);

    useEffect(() => {
        // setLoading(true)

        // const options = {
        //     method: 'GET',
        //     url: 'https://newsapi.org/v2/top-headlines',
        //     params: {
        //         category: 'general',
        //         pageSize: 6,
        //         country: 'us',
        //         apiKey: process.env.REACT_APP_NEWS_API_KEY
        //     }
        // };

        // axios.request(options).then(function (res) {
        //     console.log(res.data)
        //     setApi(res.data)
        //     setLoading(false);
        // }).catch(function (error) {
        //     console.error(error);
        // });

        (() => {
            axios.get("/statuslogin")
                .then((res) => {
                    setIsLoggedIn(res.data.loggedin)
                    // console.log(res.data)
                });
        })();

    }, [isLoggedIn]);


    const Loading = () => {        //the loading div
        let x = localStorage.getItem("accent") || 'grey'

        return <div className="d-flex justify-content-center">
            <Loader type="TailSpin"
                color={x}
                height={40}
                width={40}
            />

        </div>
    }

    let location = useLocation()


    return (
        <div className="col-4 p-3 phone-sidebar" ref={newsRef}>
            {location.pathname === '/explore' ? null : <Search />}

            <div className="p-3 sidebar mt-4">
                <h5 style={{ fontWeight: 700 }}>Trending Topics</h5>
                <p>Trending</p>
            </div>

            {user ?

                <div className="p-1 mt-4 sidebar" >
                    <h5 className="view p-3" style={{ fontWeight: 700 }}>Top Headlines</h5>
                    <ul className="col" >
                        {loading ? <Loading /> : null}
                        {api.articles.map(item => (
                            <li key={item.url} >
                                <a href={item.url} style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" className="row view">
                                    <img src={item.urlToImage} className="col-5 api-image row " alt="news" />
                                    <p className="col api-text" >{item.title} </p>
                                </a>

                            </li>
                        ))}
                    </ul>
                </div>
                :
                <div div className="mt-4 p-3 sidebar">
                    <h5 style={{ fontWeight: 700 }}>First Time on TwitClone?</h5>
                    <p>Sign up Today To Access More Features!!</p>

                    <Link to="/signup" className="d-flex justify-content-center">
                        <button className="btn login-submit btn-accent rounded-pill"
                            style={{ width: "90%", fontSize: "20px", fontWeight: 700, color: "white" }}>
                            Sign Up
                        </button>
                    </Link>

                </div>
            }
            <div className="p-3 mt-4 sticky ">
                <div className="footer row">
                    <div className="col">
                        <p>About</p>
                        <p>Terms Of Service</p>
                    </div>
                    <div className="col">
                        <p>© TwitClone 2021</p>
                        <p>Credits</p>
                    </div>
                </div>
            </div>


        </div >
    );
}

export default Sidebar;