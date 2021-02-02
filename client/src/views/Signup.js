import React from 'react';
import './css/App.css';
import './css/Signup.css';
import 'tachyons';



function Signup() {
    return (
        <div className="App fgh ">
            <div className="flex justify-center">
                <div className="form ma6 br4 animate-enter" >
                    <h4>Create an Account</h4>
                    <form className="pa4">
                        <div>
                            <input type="email" placeholder="Email" class="login-input ma3" required />
                        </div>

                        <div>
                            <input type="email" placeholder="Email" class="login-input ma3" required />
                        </div>

                        <div>
                            <input type="email" placeholder="Email" class="login-input ma3" required />
                        </div>

                        <div>
                            <input type="email" placeholder="Email" class="login-input ma3" required />
                        </div>

                        <button type="submit" class="br-pill login-submit grow mt2"> Sign Up</button>
                        {/* axios here */}

                    </form>

                </div>
            </div>
        </div>

    );
}
export default Signup;

//style={{ backgroundImage: `url(${charisse})` }}  
