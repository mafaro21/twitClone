import React, { useState } from 'react'
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";



export default function Compose() {
    let history = useHistory();


    const [tweetLoading, setTweetLoading] = useState(false)
    const [tweetErr, setTweetErr] = useState({})

    const [tweetModal, setTweetModal] = useState(true); //tweet modal
    // const tweetToggle = () => setTweetModal(!tweetModal);

    const [error, setError] = useState([]);     //using array, data comes that way
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    const wordCount = () => {   //live word counter
        document.getElementById("tweet").addEventListener('input', function () {
            var text = this.value,
                count = text.trim().replace(/\s/g, '').length;

            if (count === 280) {
                document.getElementById('show').style.color = "red"
            } else if (count >= 250) {
                document.getElementById('show').style.color = "#FF8000"
            } else if (count >= 200) {
                document.getElementById('show').style.color = "#FFB400"
            } else if (count >= 150) {
                document.getElementById('show').style.color = "#FFF800"
            } else {
                document.getElementById('show').style.color = "grey"
            }

            if (count <= 0) {// used to disable button if textarea is empty
                document.getElementById("submit-btn").disabled = true;
            } else {
                document.getElementById("submit-btn").disabled = false;
            }

            document.getElementById('show').textContent = count;

        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();


        const myForm = document.forms.tweetForm; // Or document.forms['tweetForm']
        const tweet = myForm.elements.tweet.value;
        const isValid = tweetValidation(tweet); /* <-- call the validation fn. 😀*/
        if (isValid) {
            sendToDb();
            setTweetModal(false)
            setTweetLoading(true)
        }



        function sendToDb() {
            const tweetObject = {
                content: tweet.replace(/\n/g, " ").trim()
            }

            axios.post("/tweets", tweetObject)
                .then((res) => {
                    // setTweetContext("tweeted")
                })
                .catch((error) => {
                    setTweetLoading(false)
                    setTweetModal(true)
                    setError(error.response.data.message);
                })
                .finally(() => {
                    setTweetLoading(false)
                    // document.getElementById("loading").removeChild(loading);
                });


        }
    }

    //validation check
    const tweetValidation = (twt) => {
        const tweetErr = {};
        let tweetReg = /[<>]+/;
        let isValid = true;

        if (tweetReg.test(twt)) {
            tweetErr.tweetinvalid = "Contains illegal characters";
            isValid = false;
        }
        if (twt.trim().length < 1) {
            tweetErr.tweetinvalid = "Cannot be empty";
            isValid = false;
        }

        setTweetErr(tweetErr);
        return isValid;
    }

    const TweetLoading = () => {    //loader after tweet has been sent
        return <div className="d-flex justify-content-center">
            <div className="modal-wrapper" >
                <div className=" d-flex tweet-loader" >
                    <Loader type="TailSpin"
                        color="orange"
                        height={40}
                        width={40}
                        className="d-flex "
                    />
                    <div className="mt-2 ml-3" style={{ color: 'orange' }}>Sending Spicy Tweet...</div>
                </div>
            </div>
        </div>
    }

    return (
        <div >
            {tweetLoading ? <TweetLoading /> : null}


            <div className="modal-wrapper" >
                <div className="tweettest  modal-enter" >
                    <div className="">
                        <div className="modal-view">
                            <div className="modal-header">

                                <button className="">
                                    <svg viewBox="0 0 24 24" className="icon ">
                                        <g>
                                            <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z">
                                            </path>
                                        </g>
                                    </svg>
                                </button>
                            </div>

                            <div style={{ color: "red" }} className="error-msg ">{errorDiv}</div>

                            <div className="modal-body row">
                                <div className="col-1">
                                    {/* <img src={icon} alt="example" className="user-tweet-img" /> */}
                                </div>

                                <form id="tweetForm" className="signup col" onSubmit={(e) => handleSubmit(e)}>
                                    {/*  */}

                                    <div >
                                        <textarea

                                            id="tweet"
                                            name="tweet"
                                            type="text"
                                            // value={tweet}

                                            onChange={wordCount}
                                            className=" edit-input "
                                            maxLength="280"
                                            rows="7"
                                            placeholder="Any Hot Takes?"
                                            required
                                        />

                                        <div className="container counter">
                                            {/* {count}/280 */}
                                            <span id="show">0</span><span>/280</span>
                                        </div>
                                        {Object.keys(tweetErr).map((key) => {
                                            return <div style={{ color: "red" }} className="error-msg"> {tweetErr[key]} </div>
                                        })}
                                    </div>


                                    <button
                                        id="submit-btn"
                                        className="btn login-submit btn-outline-primary rounded-pill mt-3"
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        Tweet
                                    </button>
                                </form>
                            </div>
                            {/* <div class="modal-footer">
                            <button type="button" onClick={tweetToggle} className="btn login-submit btn-primary rounded-pill mt-3">Close</button>
                        </div> */}
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}