import React from "react";
import {
    useState
} from "react";
import "../css/App.css";
import "../css/Signup.css";
import '../css/custom.scss';
import { Link } from 'react-router-dom';
import axios from "axios";

function Signup() {
    const [fullname, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setconfirmPass] = useState("");

    const [fullnameErr, setfullNameErr] = useState({}); /* <--- react validation */
    const [emailErr, setemailErr] = useState({}); /* <--- react validation */
    const [passwordErr, setpasswordErr] = useState({}); /* <--- react validation */
    const [confirmpasswordErr, setconfirmpasswordErr] = useState({}); /* <--- react validation */


    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = formValidation(); /* <--- react validation */
        if (isValid) {
            // axios
            //     .post("/register", userObject)      /* <---- CURRENT ERROR IS RIGHT HERE*/
            //     .then((res) => {
            //         console.log(res.data);
            //         let x = res.data.success;
            //         if (x === true) alert("Sign up successful!"); /* then take user to dashboard */
            //     })
            //     .catch((error) => {
            //         console.error(error.response.data);
            //         alert("Sign up failed. Press F12 for details"); /* TO FIX: display the errors properly */
            //     });
        }
    }



    const formValidation = () => {           /* <--- react validation */

        const fullnameErr = {};
        const emailErr = {};
        const passwordErr = {};
        const confirmpasswordErr = {};
        var emailpatt = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        let isValid = true;

        if (fullname.trim().length < 7) {
            fullnameErr.fullnameErrShort = "Fullname should be atleast 7 characters long";
            isValid = false;
        }

        if (!emailpatt.test(email)) {
            emailErr.emailErrNoAt = "Email is invalid!";
            isValid = false;
        }


        if (password.trim().length < 8) {
            passwordErr.passwordErrShort = "Password should be atleast 8 characters long";
            isValid = false;
        }

        if (password !== confirmPass) {
            confirmpasswordErr.passwordsNotSame = "Passwords are not matching";
            isValid = false;
        }

        setfullNameErr(fullnameErr);
        setemailErr(emailErr);
        setpasswordErr(passwordErr);
        setconfirmpasswordErr(confirmpasswordErr);
        return isValid;

    }

    // const userObject = {
    //     fullname: fullname,
    //     email: email,
    //     password: password,
    //     confirmPass: confirmPass,
    // };





    return (
        <div className="general fgh d-flex" >
            <div className="container mt-5" >
                <div className="form animate-enter container mt-5 p-5" >
                    <h3> Create an Account </h3>

                    <form className="container" onSubmit={(e) => handleSubmit(e)} >
                        <div>
                            <input
                                name="fullname"
                                type="text"
                                value={fullname}
                                onChange={(e) => setfullName(e.target.value)}
                                className="signup-input mt-4"
                                maxLength="20"
                                placeholder="Your Name"
                                required
                            />
                            {Object.keys(fullnameErr).map((key) => {/* <--- react validation */
                                return <div style={{ color: "red" }} > {fullnameErr[key]} </div>
                            })}
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="signup-input mt-1"
                                maxLength="30"
                                placeholder="Email address"
                                required
                            />
                            {Object.keys(emailErr).map((key) => {/* <--- react validation */
                                return <div style={{ color: "red" }} > {emailErr[key]} </div>
                            })}
                        </div>

                        <div>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="signup-input mt-1"
                                maxLength="20"
                                placeholder="Enter Password"
                                title="Required 8 characters or more"
                                required
                            />
                            {Object.keys(passwordErr).map((key) => {/* <--- react validation */
                                return <div style={{ color: "red" }} > {passwordErr[key]} </div>
                            })}
                        </div>

                        <div>
                            <input
                                name="confirmPass"
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setconfirmPass(e.target.value)}
                                className="signup-input mt-1"
                                maxLength="20"
                                placeholder="Confirm Password"
                                required
                            />
                            {Object.keys(confirmpasswordErr).map((key) => {/* <--- react validation */
                                return <div style={{ color: "red" }} > {confirmpasswordErr[key]} </div>
                            })}
                        </div>

                        <button
                            id="submit-btn"
                            className="btn login-submit btn-outline-primary rounded-pill mt-3"
                            type="submit"
                        >
                            Sign Up
                        </button>

                    </form>
                    <Link to="/" ><p className="mt-3">Already have an account?</p></Link>
                </div>
            </div>
        </div>
    );
}


export default Signup;