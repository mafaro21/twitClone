import React, { useEffect, useState } from "react";
import "../css/App.css";
import '../css/custom.scss';
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import Loader from "react-loader-spinner";


function Signup() {
    const [fullname, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setconfirmPass] = useState("");

    const [fullnameErr, setfullNameErr] = useState({}); /* <--- react validation */
    const [emailErr, setemailErr] = useState({}); /* <--- react validation */
    const [passwordErr, setpasswordErr] = useState({}); /* <--- react validation */
    const [confirmpasswordErr, setconfirmpasswordErr] = useState({}); /* <--- react validation */

    const [disabled, setDisabled] = useState(false);// button disabler during request

    const [loading, setLoading] = useState(false);// loading animation

    const [welcomeModal, setWelcomeModal] = useState(false);//welcome modal

    const [error, setError] = useState([]); //using array, data comes that way
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    const loadCaptcha = useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_SITE_KEY}`;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const internalError = () => {       //redirect when there is a server error
        // return <Redirect to="./Error" />;
        return window.location = "./Error";
    }

    const Loading = () => { //the loading div
        return <div>
            <Loader type="Watch"
                color="orange"
                height={30}
                width={30}
            />
        </div>
    }

    const WelcomeModal = () => {
        return <div>
            <div class="modaltest modal-welcome mt-5 modal-enter" >
                <div class="">
                    <div class="modal-view">
                        <div class="">
                            <h3 class="mt-3">Welcome New User</h3>
                            <p>Your current username is <i>firstuser69</i> , you can choose to keep it or change it down below</p>
                            <p>*You can always edit your username</p>
                        </div>
                        <div class="modal-body">
                            <form className="container signup"  >
                                {/* onSubmit={(e) => handleSubmit(e)} */}
                                <div>
                                    <input
                                        name="fullname"
                                        type="text"
                                        // value={fullname}
                                        // onChange={(e) => setfullName(e.target.value)}
                                        className="signup-input change"
                                        maxLength="20"
                                        placeholder="New Username"
                                        required
                                    />
                                    {/* {Object.keys(fullnameErr).map((key) => {
                                        return <div style={{ color: "red" }} className="error-msg"> {fullnameErr[key]} </div>
                                    })} */}
                                </div>
                                <br />

                                {/* {loading ? <Loading /> : null} */}

                                <button
                                    id="submit-btn"
                                    className="btn login-submit  btn-outline-primary rounded-pill "
                                    type="submit"
                                // disabled={disabled}         //button disabler
                                >
                                    Save
                        </button>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <Link to="/home">
                                <button type="button" className="btn login-submit modal-welcome-submit btn-primary rounded-pill mt-3">
                                    I will change it later
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(process.env.REACT_APP_SITE_KEY, { action: 'submit' })
                .then((responseToken) => {
                    sendtoServer(responseToken); // send this to the server with User Data
                });
        });

        const isValid = formValidation(); /* <--- react validation */

        async function sendtoServer(token) {
            if (isValid) {
                setDisabled(true);  //disable button
                setLoading(true);

                const userObject = {
                    fullname: fullname.trim(),
                    email: email.trim(),
                    password: password,
                    confirmPass: confirmPass,
                    responseToken: token
                };

                axios
                    .post("/register", userObject)
                    .then((res) => {
                        let x = res.data.success;
                        // if (x === true) setWelcomeModal(true); /* then take user to dashboard */
                    })
                    .catch((error) => {
                        if (error.response.status === 500) {
                            internalError();
                        }
                        else setError(error.response.data.message);     //show error message from axios

                        setTimeout(() => {
                            setDisabled(false);
                            setLoading(false);
                        }, 100);                // <--delay for button to be clickable to reduce spam   

                    });
            }
        }
    }

    const formValidation = () => {           /* <--- react validation */

        const fullnameErr = {};
        const emailErr = {};
        const passwordErr = {};
        const confirmpasswordErr = {};
        var emailpatt = /(^([0-9A-Za-z])[\w.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;
        var reg = new RegExp('[^ a-zA-Z0-9_]');

        let isValid = true;

        if (fullname.trim().length < 3) {
            fullnameErr.fullnameErrShort = "Name should be atleast 3 characters long";
            isValid = false;
        }

        if (!emailpatt.test(email)) {
            emailErr.emailErrNoAt = "Email is invalid!";
            isValid = false;
        }


        if (password.trim().length < 8) {
            passwordErr.passwordErrShort = "Required 8 or more characters";
            isValid = false;
        }

        if (password !== confirmPass) {
            confirmpasswordErr.passwordsNotSame = "Passwords do not match";
            isValid = false;
        }

        if (reg.test(fullname)) {
            fullnameErr.fullnameinvalid = "Name contains illegal characters";
            isValid = false;
        }

        setfullNameErr(fullnameErr);
        setemailErr(emailErr);
        setpasswordErr(passwordErr);
        setconfirmpasswordErr(confirmpasswordErr);

        return isValid;

    }




    return (

        <body className="general sign-pic d-flex" onLoad={loadCaptcha}  >
            <div className="container mt-5" >
                <div className=" animate-enter container mt-4 p-5" >
                    {welcomeModal ? <WelcomeModal /> : null}
                    <h3> Create an Account </h3>
                    <div style={{ color: "red" }} className="error-msg ">{errorDiv}</div>
                    <form className="container signup" onSubmit={(e) => handleSubmit(e)} >
                        <div>
                            <input
                                name="fullname"
                                type="text"
                                value={fullname}
                                onChange={(e) => setfullName(e.target.value)}
                                className="signup-input mt-4 change"
                                maxLength="20"
                                placeholder="Your Name"
                                required
                            />
                            {Object.keys(fullnameErr).map((key) => {/* <--- react validation */
                                return <div style={{ color: "red" }} className="error-msg"> {fullnameErr[key]} </div>
                            })}
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="signup-input mt-1 change"
                                maxLength="30"
                                placeholder="Email address"
                                required
                            />
                            {Object.keys(emailErr).map((key) => {/* <--- react validation */
                                return <div style={{ color: "red" }} className="error-msg"> {emailErr[key]} </div>
                            })}
                        </div>

                        <div>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="signup-input mt-1 change"
                                maxLength="20"
                                placeholder="Enter Password"
                                title="Required 8 characters or more"
                                required
                            />
                            {Object.keys(passwordErr).map((key) => {/* <--- react validation */
                                return <div style={{ color: "red" }} className="error-msg"> {passwordErr[key]} </div>
                            })}
                        </div>

                        <div>
                            <input
                                name="confirmPass"
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setconfirmPass(e.target.value)}
                                className="signup-input mt-1 change"
                                maxLength="20"
                                placeholder="Confirm Password"
                                required
                            />
                            {Object.keys(confirmpasswordErr).map((key) => {/* <--- react validation */
                                return <div style={{ color: "red" }} className="error-msg"> {confirmpasswordErr[key]} </div>
                            })}
                        </div>
                        <br />

                        {loading ? <Loading /> : null}

                        <button
                            id="submit-btn"
                            className="btn login-submit btn-outline-primary rounded-pill mt-3"
                            type="submit"
                            disabled={disabled}         //button disabler
                        >
                            Sign Up
                        </button>
                    </form>
                    <Link to="/" ><p className="mt-3 login-text">Already have an account?</p></Link>
                </div>
            </div>
        </body >

    );
}


export default Signup;
