import React, { useState, useEffect } from 'react';
import '../css/Sidebar.css';
import '../css/custom.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Header() {

    const [fullname, setFullname] = useState();
    const [username, setUsername] = useState();

    const [userModal, setUserModal] = useState(false);
    const userToggle = () => setUserModal(!userModal);

    let icon = "https://avatars.dicebear.com/api/identicon/" + username + ".svg";

    useEffect(() => {
       // getData();

        axios.get("/profile/mine")
            .then((res) => {
                //console.log(res.data); 
                localStorage.setItem('fullname', res.data.fullname);
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('bio', res.data.bio);
                let date = new Date(res.data.datejoined);
                // let x = date.getFullYear();
                let months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                // let y = months[date.getMonth()];
                let finalDate = months[date.getMonth()] + " " + date.getFullYear();
                localStorage.setItem('datejoined', finalDate);

            }).catch((err) => {
                window.location.replace("/");
            })
      
    }, []);

   function getData() {
        setFullname(localStorage.getItem('fullname'));
        setUsername(localStorage.getItem('username'));
    }


    const UserModal = () => {
        return <div className="user-modal modal-enter mr-1">
            <button
                className="text p-2 user-modal-btn "
                type="submit"
                onClick={Logout}
            >
                Log out @{username}
            </button>
        </div >
    }

    const Logout = () => {  //logout function
        axios.get("/logout")
            .then((res) => {
                localStorage.clear();
                window.location.replace("/");

            })
    }


    return (
        <header className=" header pt-3" onLoad={getData}>
            {/* col-sm-2 */}
            <div className="fixed phone-header ">

                <div className="d-flex" >
                    <Link class="header-link d-flex pl-2 " to="/home">
                        <div>
                            <svg viewBox="0 0 26 26" className="icon mr-2">
                                <g>
                                    <path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.815-.44L4.7 19.963c.214 1.215 1.308 2.062 2.658 2.062h9.282c1.352 0 2.445-.848 2.663-2.087l1.626-11.49.818.442c.364.193.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 12.133c-.107.606-.703.822-1.18.822H7.36c-.48 0-1.075-.216-1.178-.798L4.48 7.69 12 3.628l7.522 4.06-1.7 12.015z"></path>
                                    <path d="M8.22 12.184c0 2.084 1.695 3.78 3.78 3.78s3.78-1.696 3.78-3.78-1.695-3.78-3.78-3.78-3.78 1.696-3.78 3.78zm6.06 0c0 1.258-1.022 2.28-2.28 2.28s-2.28-1.022-2.28-2.28 1.022-2.28 2.28-2.28 2.28 1.022 2.28 2.28z"></path>
                                </g>
                            </svg>
                        </div>
                        <p className="header-title">Home</p>
                    </Link>
                </div>

                <div className="d-flex">
                    <Link class="header-link d-flex pl-2">
                        <div>
                            <svg viewBox="0 0 26 26" className="icon mr-2">
                                <g>
                                    <path d="M22.06 19.94l-3.73-3.73C19.38 14.737 20 12.942 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c1.943 0 3.738-.622 5.21-1.67l3.73 3.73c.292.294.676.44 1.06.44s.768-.146 1.06-.44c.586-.585.586-1.535 0-2.12zM11 17c-3.308 0-6-2.692-6-6s2.692-6 6-6 6 2.692 6 6-2.692 6-6 6z"></path>
                                </g>
                            </svg>
                        </div>
                        <p className="header-title">Explore</p>
                    </Link>
                </div>

                <div className="d-flex">
                    <Link class="header-link d-flex pl-2">
                        <div>
                            <svg viewBox="0 0 26 26" className="icon mr-2">
                                <g>
                                    <path d="M19.25 3.018H4.75C3.233 3.018 2 4.252 2 5.77v12.495c0 1.518 1.233 2.753 2.75 2.753h14.5c1.517 0 2.75-1.235 2.75-2.753V5.77c0-1.518-1.233-2.752-2.75-2.752zm-14.5 1.5h14.5c.69 0 1.25.56 1.25 1.25v.714l-8.05 5.367c-.273.18-.626.182-.9-.002L3.5 6.482v-.714c0-.69.56-1.25 1.25-1.25zm14.5 14.998H4.75c-.69 0-1.25-.56-1.25-1.25V8.24l7.24 4.83c.383.256.822.384 1.26.384.44 0 .877-.128 1.26-.383l7.24-4.83v10.022c0 .69-.56 1.25-1.25 1.25z"></path>
                                </g>
                            </svg>
                        </div>
                        <p className="header-title">Messages</p>
                    </Link>
                </div>

                <div className="d-flex">
                    <Link class="header-link d-flex pl-2" to="/profile">
                        <div>
                            <svg viewBox="0 0 26 26" class="icon mr-2">
                                <g>
                                    <path d="M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.17c-.272 2.022-.008 3.46.806 4.39.968 1.107 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.255-.223-2.71-.743c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.242.017.48-.12.654z"></path>
                                </g>
                            </svg>
                        </div>
                        <p className="header-title">Profile</p>
                    </Link>
                </div>

                <div className="d-flex">
                    <Link class="header-link d-flex pl-2">
                        <div>
                            <svg viewBox="0 0 26 26" class="icon mr-2">
                                <g>
                                    <circle cx="17" cy="12" r="1.5"></circle>
                                    <circle cx="12" cy="12" r="1.5"></circle>
                                    <circle cx="7" cy="12" r="1.5"></circle>
                                    <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path>
                                </g>

                            </svg>
                        </div>
                        <p className="header-title">More</p>
                    </Link>
                </div>

                <div className="d-flex">
                    <Link class=" d-flex pl-2">
                        <div>
                            <button
                                className="btn login-submit btn-primary rounded-pill mt-3"
                                style={{ width: "140px" }}
                            >
                                Tweet
                        </button>
                        </div>
                    </Link>
                </div>

                {userModal ? <UserModal /> : null}


                <button className="user-data d-flex row " onClick={userToggle}>
                    <img src={icon} alt="example" className="user-data-img" />

                    <div className="col">
                        {fullname}
                        <div>
                            <span>@{username}</span>
                        </div>
                    </div>

                </button>


            </div>
        </header >
    );
}