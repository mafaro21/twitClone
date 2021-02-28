import React, { useEffect, useState } from 'react';
import '../css/App.css';
import '../css/custom.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from "react-loader-spinner";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailErr, setemailErr] = useState({});   /* <--- react validation */
    const [passwordErr, setpasswordErr] = useState({});     /* <--- react validation */

    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [loading, setLoading] = useState(false);      // loading animation

    const [error, setError] = useState([]);     //using array, data comes that way
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

    const Loading = (color) => {        //the loading div

        // function colorChanger(color) {
        //     if (color) {
        //         setTimeout(() => {
        //             return color = "orange";
        //         }, 3000);
        //     } else {
        //         return color = "red";

        //     }
        // }

        return <div>
            <Loader type="Watch"
                color="orange"
                height={30}
                width={30}
            />

        </div>
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
                    email: email,
                    password: password,
                    responseToken: token
                };

                axios
                    .post("/login", userObject)
                    .then((res) => {
                        console.log(res.data);
                        let x = res.data.success;
                        if (x === true) return window.location = "./Home";
                    })
                    .catch((error) => {
                        if (error.response.status === 500) {
                            internalError();
                        }
                        else setError(error.response.data.message)      //show error message from axios

                        setTimeout(() => {          //reduce time for button to be clickable to reduce spam
                            setDisabled(false);
                            setLoading(false);
                        }, 100);                   // delay after error warning shows up

                        console.error(error.response.data);
                    });
            }
        }
    }

    const formValidation = () => {           /* <--- react validation */

        const emailErr = {};
        const passwordErr = {};
        var emailpatt = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        let isValid = true;

        if (!emailpatt.test(email)) {
            emailErr.emailErrNoAt = "Email is invalid!";
            isValid = false;
        }

        if (password.trim().length < 8) {
            passwordErr.passwordErrShort = "Password should be atleast 8 characters long";
            isValid = false;
        }


        setemailErr(emailErr);
        setpasswordErr(passwordErr);
        return isValid;

    }


    return (
        <body className="general login-pic d-flex" onLoad={loadCaptcha} >

            <div className="container mt-4">

                <div className="container mt-5 p-5 login-form">


                    <h3>LOGO HERE</h3>
                    <div style={{ color: "red" }} className="error-msg ">{errorDiv}</div>

                    <form id="captcha" className="mt-2" onSubmit={(e) => handleSubmit(e)}>

                        <div className="">
                            {Object.keys(emailErr).map((key) => {       /* <--- react validation */
                                return <div style={{ color: "red" }} className="error-msg"> {emailErr[key]} </div>
                            })}
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="login-input m-2"
                                required
                            />


                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="login-input"
                                required
                            />
                            {Object.keys(passwordErr).map((key) => {/* <--- react validation */
                                return <div style={{ color: "red" }} className="error-msg"> {passwordErr[key]} </div>
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
                            Log In
                        </button>
                    </form>

                    <h3 className="animate-enter login-text mt-5">See what’s happening around <br />
                                the world
                    </h3>

                    <h4 className="animate-enter login-text mt-5">Join TwitClone Today...</h4>

                    <Link to="/signup" ><input value="Sign Up" class="btn login-submit btn-outline-primary rounded-pill mt-1" /></Link>



                </div>

            </div>


        </body >
    );
}

export default Login;