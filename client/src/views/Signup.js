import React from 'react';
import '../css/App.css';
import '../css/Signup.css';
import 'tachyons';
import axios from 'axios'; 





function Signup() {
    return (
        <div className="App fgh ">
            <div className="flex justify-center">
                <div className="form ma6 br4 animate-enter" >
                    <h4>Create an Account</h4>
                    <form className="pa4">
                        <div>
                            <input name="fullname" id="fullname" type="text" class="login-input ma3" maxlength="20" placeholder="Your Name" required />
                            <p class="error-p"></p>
                        </div>

                        <div>
                            <input name="email" id="email" type="email" class="login-input ma3" maxlength="30" placeholder="Email address" required />
                            <p class="error-p"></p>
                        </div>

                        <div>
                            <input name="password" id="password" type="password" class="login-input ma3" maxlength="20" placeholder="Enter Password" pattern=".{8,}"
                                title="Required 8 characters or more" required />
                            <p class="error-p"></p>
                        </div>

                        <div >
                            <input name="confirmPass" id="confirmPass" type="password" class="login-input ma3" maxlength="20" placeholder="Confirm Password" required />
                            <p class="error-p"></p>
                        </div>

                        <button id="submit-btn" class="br-pill login-submit grow mt2" type="submit">Sign Up</button>
                        {/* axios here */}

                    </form>

                </div>
            </div>
        </div >

    );
}
export default Signup;

//style={{ backgroundImage: `url(${charisse})` }}  

