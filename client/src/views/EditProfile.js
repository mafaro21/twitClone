import React, { useState } from 'react'
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import Loader from "react-loader-spinner";

export default function Edit() {

    const [editFullname, setEditFullname] = useState(localStorage.getItem('fullname') || " ")
    const [editUsername, setEditUsername] = useState(localStorage.getItem('username') || " ")
    const [editBio, setEditBio] = useState(localStorage.getItem('bio') || " ")

    const [fullnameErr, setFullnameErr] = useState({}) // front end validation
    const [usernameErr, setUsernameErr] = useState({})
    const [bioErr, setBioErr] = useState({})

    const [count, setCount] = useState(0) //word counter
    const [click, setclick] = useState(false);


    const onChange = (e) => {
        setEditBio(e.target.value)
        setCount(e.target.value.length)
    }

    const clickCheck = () => {
        return <div>
            <p class="text">i have been clicked</p>
        </div>
    }

    const onClick = () => {
        setFullnameErr(false);
        setBioErr(false);
        setUsernameErr(false);
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = editValidation();

        if (isValid === true) {
            let newlines = /\n/g;

            const userObject = {
                fullname: editFullname.trim(),
                username: editUsername.trim(),
                bio: editBio.replace(newlines, " ").trim()
            }

            axios.put("/profile/mine/edit", userObject)
                .then((res) => {
                    let x = res.data.success;                       //add loading
                    if (x === true) window.location.replace("/Home"); // HOME, to refresh localStorage
                })
                .catch((err) => {
                    alert("Error! Could not update profile"); /* TO FIX: display ERRORS properly */
                    console.error(err);
                });
        }
    }

    const editValidation = () => {

        const fullnameErr = {}
        const usernameErr = {}
        const bioErr = {}
        let userReg = /^[0-9a-zA-Z_\S]+$/gi;
        let fullnameReg = /^[ \p{Han}0-9a-zA-Z_\.\'\-]+$/gi;
        let bioReg = /[<>]+/gi;

        let isValid = true;

        if (!fullnameReg.test(editFullname)) {
            fullnameErr.fullnameinvalid = "Contains illegal characters";
            isValid = false;
        }
        if (bioReg.test(editBio)) {
            bioErr.fullnameinvalid = "Contains illegal characters";
            isValid = false;
        }
        if (!userReg.test(editUsername)) {
            usernameErr.fullnameinvalid = "Contains illegal characters";
            isValid = false;
        }
        if (editFullname.trim().length < 3) {
            fullnameErr.fullnameErrShort = "Name should be atleast 3 characters long";
            isValid = false;
        }
        if (editUsername.trim().length < 3) {
            fullnameErr.fullnameErrShort = "Username should be atleast 3 characters long";
            isValid = false;
        }

        setFullnameErr(fullnameErr);
        setBioErr(bioErr);
        setUsernameErr(usernameErr);

        return isValid;
    }




    return (
        <div className="App general " >
            <div className="container  " >
                <div className="row " >

                    <Header />


                    <div className="col main-view  phone-home w-100 " >
                        {/* {loading ? <Loading /> : null} */}
                        <div className="row profile-header">

                            <div className="p-2  col row ">
                                <div className="ml-2 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div className="">
                                        <strong>Edit Profile</strong>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class=" " >
                            <div class="">
                                <div class="">
                                    <div class="row view">
                                        <h3 class="col text-center ">Edit Your Profile</h3>
                                    </div>

                                    <form className="mt-3  " onSubmit={(e) => handleSubmit(e)}>

                                        <div>
                                            <input
                                                name="fullname"
                                                type="text"
                                                value={editFullname}
                                                onChange={(e) => setEditFullname(e.target.value)}
                                                className="edit-input change "
                                                maxLength="30"
                                                placeholder="New Fullname"
                                                required
                                            />
                                            {Object.keys(fullnameErr).map((key) => {
                                                return <div style={{ color: "red" }} className="error-msg"> {fullnameErr[key]} </div>
                                            })}
                                        </div>
                                        <div>
                                            <input
                                                name="username"
                                                type="text"
                                                value={editUsername}
                                                onChange={(e) => setEditUsername(e.target.value)}
                                                className="edit-input mt-1 change"
                                                maxLength="20"
                                                placeholder="New Username"
                                                required
                                            />
                                            {Object.keys(usernameErr).map((key) => {
                                                return <div style={{ color: "red" }} className="error-msg"> {usernameErr[key]} </div>
                                            })}
                                        </div>
                                        <div>
                                            <textarea
                                                name="bio"
                                                type="test"
                                                value={editBio}
                                                onChange={onChange}
                                                onClick={() => setclick(true)}
                                                rows="4"
                                                className="edit-input mt-1 change"
                                                maxLength="100"
                                                placeholder="Bio"
                                                required
                                            />
                                            {Object.keys(bioErr).map((key) => {
                                                return <div style={{ color: "red" }} className="error-msg"> {bioErr[key]} </div>
                                            })}
                                            <div className="container counter">
                                                {count}/100
                                                {click ? <clickCheck /> : null}
                                            </div>
                                        </div>

                                        < br />

                                        {/* {loading ? <Loading /> : null} */}

                                        <button
                                            id="submit-btn"
                                            className="btn align-content-center login-submit btn-outline-primary rounded-pill mt-1"
                                            type="submit"
                                            onClick={onClick}
                                        // disabled={disabled}    // 
                                        >
                                            Save
                                            </button>
                                    </form>
                                    <div class="modal-footer">
                                        <Link to="/myprofile" type="button" className="btn login-submit btn-primary rounded-pill mt-2">Cancel</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                    <Sidebar />
                </div>
            </div>
        </div >


    );
}