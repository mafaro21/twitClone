import React, { useEffect, useState } from 'react';
import '../css/App.css';
import '../css/custom.scss';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Loader from "react-loader-spinner";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailErr, setemailErr] = useState({});   /* <--- react validation */
    const [passwordErr, setpasswordErr] = useState({});     /* <--- react validation */

    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [loading, setLoading] = useState(false);      // loading animation
    const [errorColor, setErrorColor] = useState(false);


    const [error, setError] = useState([]);     //using array, data comes that way
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    let history = useHistory();

    // const loadCaptcha = useEffect(() => {
    //     axios.get("/statuslogin")
    //         .then((res) => {
    //             if (res.data.loggedin === true) {
    //                 return history.push("/Home");
    //             }
    //         });

    //     document.title = "TwitClone - Login";

    //     const script = document.createElement('script');
    //     script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_SITE_KEY}`;
    //     document.body.appendChild(script);

    //     return () => {
    //         document.body.removeChild(script);
    //     };

    // }, []);



    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };

    const Loading = () => {
        let x = localStorage.getItem("accent") || 'grey';

        return <div>
            <Loader type="Watch"
                color={x}
                height={30}
                width={30}
            />

        </div>;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // window.grecaptcha && window.grecaptcha.ready(() => {
        //     window.grecaptcha.execute(process.env.REACT_APP_SITE_KEY, { action: 'submit' })
        //         .then((responseToken) => {
        //             sendtoServer(responseToken); // send this to the server with User Data
        //         });
        // });

        const isValid = formValidation(); /* <--- react validation */

        // async function sendtoServer(token) {
        if (isValid) {
            setError(false);
            setDisabled(true);  //disable button
            setLoading(true);
            const userObject = {
                email: email.trim(),
                password: password,
                // responseToken: token
            };

            axios
                .post("/login", userObject)
                .then((res) => {
                    let x = res.data.success;
                    if (x === true) return history.push("/home");
                })
                .catch((error) => {
                    if (error.response.status === 500) {
                        internalError();
                    }
                    else setError(error.response.data.message);     //show error message from axios
                }).finally(() => {
                    setDisabled(false);
                    setLoading(false);      //re-enable the button + disable loading.
                });
        }
        // }
    };

    const formValidation = () => {           /* <--- react validation */

        const emailErr = {};
        const passwordErr = {};
        var emailpatt = /(^([0-9A-Za-z])[\w\.\-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        let isValid = true;

        if (!emailpatt.test(email)) {
            emailErr.emailErrNoAt = "Email is invalid!";
            isValid = false;
        }

        if (password.trim().length < 1) {
            passwordErr.passwordErrShort = "Password cannot be empty";
            isValid = false;
        }


        setemailErr(emailErr);
        setpasswordErr(passwordErr);

        if (!isValid || error.length > 2) {
            setErrorColor(true);
        }
        return isValid;

    };


    return (
        <body className="App general text login-pic display" onLoad={loadCaptcha} >

            <div className="container mt-4">

                <div className="container mt-5 p-5 login-form">


                    <h3 style={{ fontWeight: 700 }} className="text">Welcome back. Login</h3>
                    <div style={{ color: "red" }} className="error-msg ">{errorDiv}</div>

                    <form id="captcha" className="mt-2" onSubmit={(e) => handleSubmit(e)}>

                        <div className="text">
                            {Object.keys(emailErr).map((key) => {
                                return <div style={{ color: "red" }} className="error-msg"> {emailErr[key]} </div>;
                            })}
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className={errorColor ? "login-error m-2 login-text" : "login-input m-2 login-text"}
                                required
                            />


                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={errorColor ? "login-error login-text" : "login-input login-text"}
                                required
                            />
                            {Object.keys(passwordErr).map((key) => {
                                return <div style={{ color: "red" }} className="error-msg"> {passwordErr[key]} </div>;
                            })}
                        </div>
                        <br />
                        {loading ? <Loading /> : null}

                        <button
                            id="submit-btn"
                            className="btn login-submit btn-accent rounded-pill mt-3"
                            type="submit"
                            disabled={disabled}         //button disabler
                        >
                            Log In
                        </button>
                    </form>

                    <h3 className="animate-enter login-text mt-5" style={{ color: 'white' }}>See what’s happening around <br />
                        the world
                    </h3>

                    <h4 className="animate-enter login-text text mt-5" >Join TwitClone Today...</h4>

                    <Link to="/signup" >
                        <button
                            className="btn login-submit btn-accent rounded-pill mt-1"
                            disabled={disabled}         //button disabler

                        >
                            Sign Up
                        </button>
                    </Link>



                </div>

            </div>


        </body >
    );
}

export default Login;