import React from 'react'
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import unf1 from '../images/unf1.jpg';
import unf2 from '../images/unf2.jpg';


export default function UserNotFound() {


    let x = window.location.pathname
    let path = x.split("/UserNotFound/")
    let finalPath = path[1]
    console.log(finalPath)

    return (
        <div className="App general" >
            <Navbar />

            <div className="container  " >
                <div className="row " >

                    <Header />
                    <div className="col main-view phone-home " >
                        <div className={window.scrollY === 0 ? "row profile-header view" : "row profile-header-scroll view"}>

                            <div className="p-2  col row ">
                                <div className="ml-2 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div >
                                        <strong className="text">Profile</strong>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className=" banner row" >
                            <img src={unf2} alt="example" className="header-photo " />

                            <div className="p-2 col ">
                                <div className="">
                                    <img src={unf1} alt="example" className="profile-logo" />

                                </div>

                                <div className="p-2 profile-view col">

                                    <strong style={{ fontWeight: 700, fontSize: '20px' }}>@{finalPath}</strong>


                                </div>

                                <div className="d-flex justify-content-center p-2">
                                    <i><span style={{ fontSize: "18px", fontWeight: 'bolder' }}>Gay hands looked for this account</span></i>
                                </div>
                            </div>
                        </div>

                    </div>

                    <Sidebar />

                </div>
            </div>
        </div>



    )
}