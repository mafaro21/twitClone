import React, { useState, useEffect } from 'react';
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useHistory, Redirect, useParams } from 'react-router-dom';
import Loader from "react-loader-spinner";
import OffCanvas from '../components/OffCanvas';

export default function Edit() {
    let history = useHistory();

    const [editFullname, setEditFullname] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editBio, setEditBio] = useState('');

    const [fullnameErr, setFullnameErr] = useState({}); // front end validation
    const [usernameErr, setUsernameErr] = useState({});
    const [bioErr, setBioErr] = useState({});

    const [serverError, setserverError] = useState(false); // <-- for redirect on Server Error

    const [count, setCount] = useState(0); //word counter

    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [loading, setLoading] = useState(false);      // loading animation

    const { username } = useParams();

    const [errorColor, setErrorColor] = useState(false);

    const [error, setError] = useState([]);     //using array, data comes that way
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    useEffect(() => {

        axios.get(`/profile/user/${username}`)  //getting profile data for anyone
            .then((res) => {
                setEditBio(res.data[0].bio);
                setEditFullname(res.data[0].fullname);
                setEditUsername(res.data[0].username);
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) {
                    internalError();
                }
            });
    }, [username]);

    const internalError = () => {       //redirect when there is a server error
        setserverError(true);
    };

    const onChange = (e) => {
        setEditBio(e.target.value);
        setCount(e.target.value.length);
    };


    const onClick = () => {
        setFullnameErr(false);
        setBioErr(false);
        setUsernameErr(false);
    };

    const Loading = () => {        //the loading div
        let x = localStorage.getItem("accent") || 'grey';

        return <div className="d-flex justify-content-center ">
            <Loader type="ThreeDots"
                color={x}
                height={40}
                width={40}
                className="d-flex "
            />

        </div>;
    };


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
            };

            axios.put("/profile/mine/edit", userObject)
                .then((res) => {
                    if (res.data.success === true) history.push(`/u/${userObject.username}`); //relocate to whatever username we have been given
                })
                .catch((error) => {
                    setError(error.response.data.message);
                })
                .finally(() => {
                    setDisabled(false);  //stop disable button and loading.
                    setLoading(false);
                });
        }
    };

    const editValidation = () => {

        const fullnameErr = {};
        const usernameErr = {};
        const bioErr = {};
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

        if (!isValid || error.length > 2) {
            setErrorColor(true);
        }

        return isValid;
    };




    return (
        <div className="App general " >
            {serverError && <Redirect to="/Error" />}

            <div className="container  " >
                <div className="row " >

                    <Header />


                    <div className="col main-view  phone-home w-100 " >
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
                                <OffCanvas />

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
                                            <span>-- select a color for your header --</span>
                                            <input
                                                type="color"
                                                name="color"
                                                className="mb-2 ml-3"
                                                style={{ width: "10%", padding: "-1px", border: "none" }}
                                                disabled={disabled}
                                                placeholder="select a color"
                                            />

                                            <input
                                                name="fullname"
                                                type="text"
                                                value={editFullname}
                                                onChange={(e) => setEditFullname(e.target.value)}
                                                className={errorColor ? "edit-error change " : "edit-input change "}
                                                maxLength="30"
                                                placeholder="New Fullname..."
                                                disabled={disabled}
                                                required
                                            />
                                            {Object.keys(fullnameErr).map((key) => {
                                                return <div style={{ color: "red" }} className="error-msg"> {fullnameErr[key]} </div>;
                                            })}
                                        </div>
                                        <div>
                                            <input
                                                name="username"
                                                type="text"
                                                value={editUsername}
                                                onChange={(e) => setEditUsername(e.target.value)}
                                                className={errorColor ? "edit-error mt-1 change" : "edit-input mt-1 change"}
                                                maxLength="20"
                                                placeholder="New Username..."
                                                disabled={disabled}
                                                required
                                            />
                                            {Object.keys(usernameErr).map((key) => {
                                                return <div style={{ color: "red" }} className="error-msg"> {usernameErr[key]} </div>;
                                            })}
                                        </div>
                                        <div>
                                            <textarea
                                                name="bio"
                                                type="test"
                                                value={editBio}
                                                onChange={onChange}
                                                rows="4"
                                                className={errorColor ? "edit-error mt-1 change" : "edit-input mt-1 change"}
                                                maxLength="100"
                                                placeholder="Bio..."
                                                disabled={disabled}
                                                required
                                            />
                                            {Object.keys(bioErr).map((key) => {
                                                return <div style={{ color: "red" }} className="error-msg"> {bioErr[key]} </div>;
                                            })}
                                            <div className="container counter">
                                                {count}/100
                                            </div>
                                        </div>

                                        < br />
                                        <div style={{ color: "red" }} className="error-msg ">{errorDiv}</div>

                                        <button
                                            className="btn align-content-center login-submit btn-accent-outline rounded-pill mt-1"
                                            type="submit"
                                            onClick={onClick}
                                            disabled={disabled}    // button disabler
                                        >
                                            {loading ? <Loading /> : 'Save'}
                                        </button>

                                    </form>
                                    <div className="modal-footer">
                                        <div
                                            onClick={() => history.goBack()}
                                            type="button"
                                            className="btn login-submit btn-accent rounded-pill mb-2"
                                        >
                                            <div className="mt-1">
                                                Cancel
                                            </div>
                                        </div>
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