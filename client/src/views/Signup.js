import React from "react";
import { useState } from "react";
import "../css/App.css";
import "../css/Signup.css";
import "tachyons";
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
        if(x === true) alert("Sign up successful!");
        else alert("Sign up failed. See console (F12) for details");
      })
      .catch((error) => {
        console.error(error.response.data);
      });

    //  this.setState({ name: '', email: '' })
  };
  return (
    <div className="App fgh ">
      <div className="flex justify-center">
        <div className="form ma6 br4 animate-enter">
          <h4>Create an Account</h4>
          <form className="pa4" onSubmit={(e) => handleSubmit(e)}>
            <div>
              <input
                name="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setfullName(e.target.value)}
                className="login-input ma3"
                maxLength="20"
                placeholder="Your Name"
                required
              />
              <p className="error"></p>
            </div>

            <div>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input ma3"
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
                className="login-input ma3"
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
                className="login-input ma3"
                maxLength="20"
                placeholder="Confirm Password"
                required
              />
              <p className="error"></p>
            </div>

            <button
              id="submit-btn"
              className="br-pill login-submit grow mt2"
              type="submit"
            >
              Sign Up
            </button>
            {/* axios here */}
          </form>
        </div>
      </div>
    </div>
  );
}
export default Signup;

//style={{ backgroundImage: `url(${charisse})` }}
