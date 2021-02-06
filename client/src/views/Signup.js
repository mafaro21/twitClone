import React from "react";
import { useState } from "react";
import "../css/App.css";
import "../css/Signup.css";
import '../css/custom.scss';
// import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";

function Signup() {
    const [fullname, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setconfirmPass] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const userObject = {
            fullname: fullname,
            email: email,
            password: password,
            confirmPass: confirmPass,
        };

        axios
            .post("/register", userObject)
            .then((res) => {
                console.log(res.data);
                let x = res.data.success;
                if (x === true) alert("Sign up successful!"); /* then take user to dashboard */
            })
            .catch((error) => {
                console.error(error.response.data);
                alert("Sign up failed. Press F12 for details"); /* TO FIX: display the errors properly */
            });
    };

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
                            <p className="error"></p>
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
                                pattern=".{8,}"
                                title="Required 8 characters or more"
                                required
                            />
                            <p className="error"></p>
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
                            <p className="error"></p>
                        </div>

                        <button
                            id="submit-btn"
                            className="btn login-submit btn-outline-primary rounded-pill mt-3"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                    {/* ---- END OF FORM --- */}
                </div>
            </div>
        </div>
    );
}
export default Signup;

