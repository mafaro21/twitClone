import React, { useState, useContext, useRef } from 'react'
import { UserContext } from '../Contexts/UserContext';
import OutsideClick from './OutsideClick';
import { Link, useHistory, useLocation } from 'react-router-dom';
import logo from '../images/logo.png'
import guest from '../images/guest.png'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';

export default function OffCanvas() {
    const [user] = useContext(UserContext);
    const ref = useRef();   //clicking outside closes modal
    let history = useHistory()

    const [offCanvas, setOffCanvas] = useState(false)
    const offCanvasToggle = () => setOffCanvas(!offCanvas)

    let icon = `https://avatars.dicebear.com/api/gridy/${user.username}.svg`;

    OutsideClick(ref, () => {
        setOffCanvas(false);

    });

    let location = useLocation();    //for current location
    let path = location.pathname;

    const Menu = () => {
        return <div className="offcanvas-wrapper " >
            <div className="text offcanvas">


                <div className="d-flex justify-content-end view">
                    <button className="" onClick={offCanvasToggle}>
                        <svg viewBox="0 0 24 24" className="back-button ">
                            <g>
                                <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z">
                                </path>
                            </g>
                        </svg>
                    </button>
                </div>

                <Link className=" nav-logo  " to="/home">
                    {/* <svg width="26px" height="40px" viewBox="0 0 256 209" version="1.1" preserveAspectRatio="xMidYMid">
                        <g>
                            <path d="M256,25.4500259 C246.580841,29.6272672 236.458451,32.4504868 225.834156,33.7202333 C236.678503,27.2198053 245.00583,16.9269929 248.927437,4.66307685 C238.779765,10.6812633 227.539325,15.0523376 215.57599,17.408298 C205.994835,7.2006971 192.34506,0.822 177.239197,0.822 C148.232605,0.822 124.716076,24.3375931 124.716076,53.3423116 C124.716076,57.4586875 125.181462,61.4673784 126.076652,65.3112644 C82.4258385,63.1210453 43.7257252,42.211429 17.821398,10.4359288 C13.3005011,18.1929938 10.710443,27.2151234 10.710443,36.8402889 C10.710443,55.061526 19.9835254,71.1374907 34.0762135,80.5557137 C25.4660961,80.2832239 17.3681846,77.9207088 10.2862577,73.9869292 C10.2825122,74.2060448 10.2825122,74.4260967 10.2825122,74.647085 C10.2825122,100.094453 28.3867003,121.322443 52.413563,126.14673 C48.0059695,127.347184 43.3661509,127.988612 38.5755734,127.988612 C35.1914554,127.988612 31.9009766,127.659938 28.694773,127.046602 C35.3777973,147.913145 54.7742053,163.097665 77.7569918,163.52185 C59.7820257,177.607983 37.1354036,186.004604 12.5289147,186.004604 C8.28987161,186.004604 4.10888474,185.75646 0,185.271409 C23.2431033,200.173139 50.8507261,208.867532 80.5109185,208.867532 C177.116529,208.867532 229.943977,128.836982 229.943977,59.4326002 C229.943977,57.1552968 229.893412,54.8901664 229.792282,52.6381454 C240.053257,45.2331635 248.958338,35.9825545 256,25.4500259" fill="#55acee"></path>
                        </g>
                    </svg> */}
                    <img src={logo} alt='logo test' className="logo" />

                </Link >

                {!user.loggedin === true ?
                    <Link to="/explore" className={path === '/explore' ? "d-flex phone-header-link-active" : "d-flex phone-header-link "}>
                        <div className=" d-flex  ">
                            <div>
                                <svg viewBox="0 0 26 26" className="icon mr-2">
                                    <g>
                                        <path d="M22.06 19.94l-3.73-3.73C19.38 14.737 20 12.942 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c1.943 0 3.738-.622 5.21-1.67l3.73 3.73c.292.294.676.44 1.06.44s.768-.146 1.06-.44c.586-.585.586-1.535 0-2.12zM11 17c-3.308 0-6-2.692-6-6s2.692-6 6-6 6 2.692 6 6-2.692 6-6 6z"></path>
                                    </g>
                                </svg>
                            </div>
                            <p className=" " style={{ fontWeight: 700 }}>Explore</p>
                        </div>
                    </Link>
                    : null}

                {!user.loggedin === true ?
                    <Link to="/more" className={path === '/more' ? "d-flex phone-header-link-active more" : "d-flex phone-header-link more"}>
                        <div className=" d-flex ">
                            <div>
                                <svg viewBox="0 0 26 26" className="icon mr-2">
                                    <g>
                                        <circle cx="17" cy="12" r="1.5"></circle>
                                        <circle cx="12" cy="12" r="1.5"></circle>
                                        <circle cx="7" cy="12" r="1.5"></circle>
                                        <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path>
                                    </g>

                                </svg>
                            </div>
                            <p className=" "
                                style={{ fontWeight: 700 }}
                            >
                                More
                            </p>
                        </div>
                    </Link>
                    : null}

                {user.loggedin ? <div className=" mt-2" style={{ fontSize: '16px' }}>
                    <img src={icon} alt='logo test' className="logo mt-2" />

                    <div>{user.fullname}</div>
                    <span>@{user.username}</span>
                </div>
                    :
                    null
                }

                {user.loggedin ?
                    <div className="offcanvas-button mr-1 " style={{ fontSize: '14px' }}>
                        <button
                            className="text p-2 btn-accent rounded"
                            type="submit"
                            onClick={Logout}
                        >
                            Log out @{user.username}
                        </button>
                    </div >
                    :
                    <div className="offcanvas-button d-flex">
                        <button
                            className=" btn login-submit rounded-pill btn-accent w-50"
                            type="submit"
                            onClick={Login}
                        >
                            Log In
                        </button>

                        <button
                            className="btn login-submit rounded-pill btn-accent-outline w-50"
                            type="submit"
                            onClick={Signup}
                        >
                            SignUp
                        </button>
                    </div >
                }
            </div>
        </div>
    }

    const Logout = () => {
        axios.get("/logout")
            .then(() => {
                history.push("/");
            });
    };

    const Login = () => {
        return history.push("/")
    }

    const Signup = () => {
        return history.push("/signup")

    }


    return (
        <div className="just-mobile">
            {/* <img src={user.loggedin ? icon : guest} alt="user-image" className="user-data-img phone-only" onClick={() => offCanvasToggle()} ref={ref} /> */}
            <div ref={ref}>
                <FontAwesomeIcon icon={faEllipsisH} size="lg" onClick={() => offCanvasToggle()} />
            </div>
            {offCanvas ? <Menu /> : null}
        </div>
    )
}
