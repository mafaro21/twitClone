import React, { useState } from 'react'
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from "react-loader-spinner";
// import Loader from "react-loader-spinner";

export default function Edit() {

    const [editFullname, setEditFullname] = useState(sessionStorage.getItem('fullname') || "")
    const [editUsername, setEditUsername] = useState(sessionStorage.getItem('username') || "")
    const [editBio, setEditBio] = useState(sessionStorage.getItem('bio') || "")

    const [fullnameErr, setFullnameErr] = useState({}) // front end validation
    const [usernameErr, setUsernameErr] = useState({})
    const [bioErr, setBioErr] = useState({})

    const [count, setCount] = useState(0) //word counter

    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [loading, setLoading] = useState(false);      // loading animation

    const [error, setError] = useState([]);     //using array, data comes that way
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    const onChange = (e) => {
        setEditBio(e.target.value)
        setCount(e.target.value.length)
    }


    const onClick = () => {
        setFullnameErr(false);
        setBioErr(false);
        setUsernameErr(false);
    }

    const Loading = () => {        //the loading div
        return <div className="d-flex mt-2">
            <Loader type="TailSpin"
                color="orange"
                height={40}
                width={40}
                className="d-flex "
            />
            <div className="mt-2 ml-3" style={{ color: 'orange' }}>Saving Changes....</div>

        </div>
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = editValidation();

        if (isValid === true) {
            setDisabled(true);  //disable button
            setLoading(true);

            const userObject = {
                fullname: editFullname.trim(),
                username: editUsername.trim(),
                bio: editBio.replace(/\n/g, " ").trim()
            }

            axios.put("/profile/mine/edit", userObject)
                .then((res) => {
                    let x = res.data.success;
                    if (x === true) window.location.replace("/myprofile");
                })
                .catch((error) => {
                    setError(error.response.data.message);
                    console.log(error.response.data);
                })
                .finally(() => {
                    setDisabled(false);  //stop disable button and loading.
                    setLoading(false);
                });
        }
    }

    const editValidation = () => {

        const fullnameErr = {}
        const usernameErr = {}
        const bioErr = {}
        let userReg = /^[0-9a-zA-Z_\S]+$/gi;
        // eslint-disable-next-line
        let fullnameReg = /^[ \p{Han}0-9a-zA-Z_\.\'\-]+$/gi;
        let bioReg = /[<>]+/;

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
        if (editFullname.trim().length < 1) {
            fullnameErr.fullnameErrShort = "Cannot be empty";
            isValid = false;
        }
        if (editUsername.trim().length < 3) {
            fullnameErr.fullnameErrShort = "Should be atleast 3 characters long";
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



                        <div className=" " >
                            <div className="">
                                <div className="">
                                    <div className="row view">
                                        <h3 className="col text-center ">Edit Your Profile</h3>
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
                                            </div>
                                        </div>

                                        < br />
                                        <div style={{ color: "red" }} className="error-msg ">{errorDiv}</div>
                                        {loading ? <Loading /> : null}

                                        <button
                                            id="submit-btn"
                                            className="btn align-content-center login-submit btn-outline-primary rounded-pill mt-1"
                                            type="submit"
                                            onClick={onClick}
                                            disabled={disabled}    // button disabler
                                        >
                                            Save
                                            </button>

                                    </form>
                                    <div className="modal-footer">
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