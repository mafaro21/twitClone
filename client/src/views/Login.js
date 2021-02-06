import React from 'react';
import '../css/App.css';
import '../css/custom.scss';
// import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="general fghh d-flex">
            <div className="container mt-5">

                <div className="container mt-5 p-5 form1">
                    <h2>LOGO HERE</h2>
                    <form className="mt-2">

                        <div className="">
                            <input type="email" placeholder="Email" class="login-input m-2" required />
                            <input type="password" placeholder="Password" class="login-input" required />
                        </div>

                        <input type="submit" value="Log In" class="btn login-submit btn-outline-primary rounded-pill mt-4" />

                    </form>

                    <h3 className="animate-enter mt-5">See what’s happening around <br />
                                the world
                            </h3>

                    <h4 className="animate-enter mt-5">Join TwitClone Today...</h4>

                    <Link to="/signup" ><input value="Sign Up" class="btn login-submit btn-outline-primary rounded-pill mt-1" /></Link>



                </div>

            </div>


        </div >
    );
}

export default Login;