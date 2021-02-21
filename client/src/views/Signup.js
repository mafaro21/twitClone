import React, { useEffect } from "react";
import dotenv from 'dotenv';
import {
    useState
} from "react";
import "../css/App.css";
// import "../css/Signup.css";
import '../css/custom.scss';
import { Link } from 'react-router-dom';
import axios from "axios";
dotenv.config();


function Signup() {
    const [fullname, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setconfirmPass] = useState("");

    const [fullnameErr, setfullNameErr] = useState({}); /* <--- react validation */
    const [emailErr, setemailErr] = useState({}); /* <--- react validation */
    const [passwordErr, setpasswordErr] = useState({}); /* <--- react validation */
    const [confirmpasswordErr, setconfirmpasswordErr] = useState({}); /* <--- react validation */

    const loadCaptcha = useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://www.google.com/recaptcha/api.js?render=6LfctFAaAAAAAMyuFMgr3a2J3lK4RYZF7xK9gMFB";

        document.body.appendChild(script);
        // let mybox = document.getElementById("demo");
        // mybox.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    async function handleSubmit(e) {
        //let SITE_KEY = process.env.SITE_KEY;
        e.preventDefault();

        const isCaptchaValid = await window.grecaptcha.ready(function () {
            window.grecaptcha.execute("6LfctFAaAAAAAMyuFMgr3a2J3lK4RYZF7xK9gMFB", { action: 'submit' }).then(function (responseToken) {

                axios.post("/captchaverify", responseToken)
                    .then((res) => {
                        console.log(res.data);
                        return res.data.success;
                    })
                    .catch((error) => {
                        console.error(error.response);
                    });
            });
        });

        const isValid = formValidation(); /* <--- react validation */
        if (isValid && isCaptchaValid) {
            alert('successful captcha validation');
            const userObject = {
                fullname: fullname,
                email: email,
                password: password,
                confirmPass: confirmPass,
            };

            // axios
            //     .post("/register", userObject)
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
        else {
            alert('you are damn robot');
        }
    }



    const formValidation = () => {           /* <--- react validation */

        const fullnameErr = {};
        const emailErr = {};
        const passwordErr = {};
        const confirmpasswordErr = {};
        var emailpatt = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;
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
            passwordErr.passwordErrShort = "Password should be atleast 8 characters long";
            isValid = false;
        }

        if (password !== confirmPass) {
            confirmpasswordErr.passwordsNotSame = "Passwords are not matching";
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
                                return <div style={{ color: "red" }} className="error-msg"> {fullnameErr[key]} </div>
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
                                return <div style={{ color: "red" }} className="error-msg"> {emailErr[key]} </div>
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
                                return <div style={{ color: "red" }} className="error-msg"> {passwordErr[key]} </div>
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
                                return <div style={{ color: "red" }} className="error-msg"> {confirmpasswordErr[key]} </div>
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
                    <Link to="/" ><p className="mt-3 login-text">Already have an account?</p></Link>
                </div>
            </div>
            <div id="demo"></div>

            {/* <div dangerouslySetInnerHTML={{ __html: codeStr }} /> */}
        </body>

    );
}


export default Signup;