import React from 'react';
import './css/App.css';
import clarisse from './images/clarisse-meyer.jpg';
import derick from './images/derick-anies.jpg';
import 'tachyons';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="App">
            <div className="App-header">
                <div className="content-left fl w-50">
                    <div>
                        <img src={clarisse} className="hp-pic mw-100" alt="leftPic" />
                    </div>
                    <div>
                        <img src={derick} className="hp-pic mw-100" alt="rightPic" />
                    </div>
                </div>

                <div className="fl w-50">
                    <div className=" ma6 ">

                        <form>
                            <div>
                                <input type="email" placeholder="Email" class="login-input ma3" required />
                                <input type="password" placeholder="Password" class="login-input" required />
                            </div>

                            <input type="submit" value="Log In" class="br-pill login-submit grow " />

                        </form>

                        <h2 className="animate-enter">See what’s happening around <br />
                                the world
                            </h2>

                        <h3 className="pt6 animate-enter">Join TwitClone Today...</h3>

                        <Link to="/signup" ><button class="br-pill login-submit grow " >Sign Up</button> </Link>



                    </div>




                </div>



            </div>



        </div >
    );
}

export default Login;