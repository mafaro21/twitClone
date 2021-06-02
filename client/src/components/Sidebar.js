import React, { useRef, useContext } from 'react';
import '../css/Sidebar.css';
import '../css/Navbar.css';
import '../css/custom.scss';
import { Link, useLocation } from 'react-router-dom';
import Search from './Search';
import { UserContext } from '../Contexts/UserContext';
import { ApiContext } from '../Contexts/ApiContext';
import { ToFollowContext } from '../Contexts/ToFollowContext';

function Sidebar() {
    const [user] = useContext(UserContext)

    const [apiData] = useContext(ApiContext);

    const [toFollow] = useContext(ToFollowContext)

    const newsRef = useRef(false);

    let location = useLocation()


    return (
        <div className="col-4 p-3 phone-sidebar " ref={newsRef}>
            {location.pathname === '/explore' ? null : <Search />}

            {user.loggedin === true ?
                <div className="p-1 sidebar mt-4 ">
                    <h5 className="view p-3" style={{ fontWeight: 700 }}>People You Should Follow</h5>
                    <ul className="col " >
                        {toFollow.data.map((item, key) => {
                            let icon = "https://avatars.dicebear.com/api/gridy/" + item.username + ".svg";

                            return <div className="p-2 view row main-post-div modal-enter" key={key}>
                                <div className="col-1.5">              {/* <--- user avi */}
                                    <Link
                                        to={`/u/${item.username}`}
                                    >
                                        <img src={icon} alt="example" className="user-logo" />
                                    </Link>

                                </div>

                                <Link to={`/u/${item.username}`} className="col user-name-tweet post-div" >
                                    {/* <--- user content */}
                                    <div  >
                                        <div >
                                            <Link
                                                to={`/u/${item.username}`}
                                                className="name-link"
                                            >
                                                <strong >{item.fullname}</strong>&nbsp;
                                            </Link>
                                            <div className="sidebar-username">@{item.username}</div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        })}
                    </ul>
                </div>
                : null}

            {user.loggedin === true ?

                <div className="p-1 mt-4 sidebar" >
                    <h5 className="view p-3" style={{ fontWeight: 700 }}>New Stories</h5>
                    <ul className="col " >
                        {apiData.articles.map(item => (
                            <li key={item.url} className="modal-enter ">
                                <a href={item.url} style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" className="row view main-post-div">
                                    <img src={item.urlToImage} className="col-6 api-image row mt-1" alt="news" />
                                    <p className="col api-text " >{item.title} </p>
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
                        <a class="github-button" href="https://github.com/mafaro21" aria-label="Follow @ntkme on GitHub">Follow @mafaro21</a>

                        <a class="github-button" href="https://github.com/mafaro21/twitClone" data-icon="octicon-star" aria-label="Star mafaro21/twitClone on GitHub">Star</a>
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