import React from 'react';
import '../css/App.css';
import '../css/custom.scss';
// import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailErr, setemailErr] = useState({}); /* <--- react validation */
    const [passwordErr, setpasswordErr] = useState({}); /* <--- react validation */

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = formValidation(); /* <--- react validation */
        if (isValid) {

            const userObject = {
                email: email,
                password: password,
            };

            axios
                .post("/login", userObject)
                .then((res) => {
                    console.log(res.data);
                    let x = res.data.success;
                    if (x === true) alert("Login up successful!"); /* then take user to dashboard */
                })
                .catch((error) => {
                    console.error(error.response.data);
                    alert("Login up failed. Press F12 for details"); /* TO FIX: display the errors properly */
                });
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
        <div className="general login-pic d-flex">

            <div className="container mt-4">

                <div className="container mt-5 p-5 login-form">



                    <h3>LOGO HERE</h3>
                    <form className="mt-2" onSubmit={(e) => handleSubmit(e)}>

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

                        <input type="submit" value="Log In" class="btn login-submit btn-outline-primary rounded-pill mt-4" />

                    </form>

                    <h3 className="animate-enter login-text mt-5">See what’s happening around <br />
                                the world
                    </h3>

                    <h4 className="animate-enter login-text mt-5">Join TwitClone Today...</h4>

                    <Link to="/signup" ><input value="Sign Up" class="btn login-submit btn-outline-primary rounded-pill mt-1" /></Link>



                </div>

            </div>


        </div >
    );
}

export default Login;