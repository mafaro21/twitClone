import React from 'react';
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import deer from '../images/hari-nandakumar.jpg';
import derick from '../images/derick-anies.jpg';

export default function Profile() {

    return (
        <div className="App general ">
            <div className="container  ">
                <div className="row ">

                    <Header />

                    <div className="col main-view  phone-home w-100 ">
                        <div className="row profile-header">
                            <div className="p-2  col row ">
                                <div className="ml-2 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div className="">
                                        first user
                                    </div>
                                    <p><span>0 Tweets</span></p>
                                </div>

                            </div>
                        </div>

                        <div className=" banner row">
                            <img src={deer} alt="example" className="header-photo " />

                            <div className="p-2 view col ">
                                <div className="">
                                    <img src={derick} alt="example" className="profile-logo" />

                                    <div className="banner-right ">
                                        <button
                                            className="btn banner-follow btn-outline-primary rounded-pill mt-3"
                                            type="submit">
                                            <svg viewBox="0 0 26 26" className="banner-msg ">
                                                <g>
                                                    <path d="M19.25 3.018H4.75C3.233 3.018 2 4.252 2 5.77v12.495c0 1.518 1.233 2.753 2.75 2.753h14.5c1.517 0 2.75-1.235 2.75-2.753V5.77c0-1.518-1.233-2.752-2.75-2.752zm-14.5 1.5h14.5c.69 0 1.25.56 1.25 1.25v.714l-8.05 5.367c-.273.18-.626.182-.9-.002L3.5 6.482v-.714c0-.69.56-1.25 1.25-1.25zm14.5 14.998H4.75c-.69 0-1.25-.56-1.25-1.25V8.24l7.24 4.83c.383.256.822.384 1.26.384.44 0 .877-.128 1.26-.383l7.24-4.83v10.022c0 .69-.56 1.25-1.25 1.25z"></path>
                                                </g>
                                            </svg>
                                        </button>
                                        <br />
                                        <button
                                            className="btn banner-follow btn-outline-primary rounded-pill mt-3"
                                            type="submit">
                                            Follow
                                        </button>
                                    </div>
                                </div>
                                <div className="p-2 col">
                                    first user
                                    <p><span>@firstuser69</span></p>

                                    <div>
                                        bio
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="p-2 view row ">
                            hello
                        </div>

                    </div>



                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
