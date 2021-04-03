import React from 'react'
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
// import axios from 'axios';

export default function Compose() {


    return (
        <div >
            {/* ref={ref} */}
            <div className="modal-wrapper" >
                <div className="tweettest  modal-enter" >
                    <div className="">
                        <div className="modal-view">
                            <div className="modal-header">
                                <button className="" >
                                    {/* onClick={tweetToggle} */}
                                    <svg viewBox="0 0 24 24" className="icon ">
                                        <g>
                                            <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z">
                                            </path>
                                        </g>
                                    </svg>
                                </button>
                            </div>

                            {/* <div style={{ color: "red" }} className="error-msg ">{errorDiv}</div> */}

                            <div className="modal-body row">
                                <div className="col-1">
                                    {/* <img src={icon} alt="example" className="user-tweet-img" /> */}
                                </div>

                                <form id="tweetForm" className="signup col"  >
                                    {/* onSubmit={(e) => handleSubmit(e)} */}

                                    <div >
                                        <textarea

                                            id="tweet"
                                            name="tweet"
                                            type="text"
                                            // value={tweet}

                                            // onChange={wordCount}
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
                                        {/* {Object.keys(tweetErr).map((key) => {
                                            return <div style={{ color: "red" }} className="error-msg"> {tweetErr[key]} </div>
                                        })} */}
                                    </div>


                                    <button
                                        id="submit-btn"
                                        className="btn login-submit btn-outline-primary rounded-pill mt-3"
                                        type="submit"
                                    // onClick={handleSubmit}
                                    // disabled={disabled}       //button disabler
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