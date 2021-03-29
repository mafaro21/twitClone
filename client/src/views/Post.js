import React, { useState, useEffect } from 'react'
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Interactive from '../components/Interactive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart'

export default function Post() {

    const [fullname, setFullname] = useState();
    const [username, setUsername] = useState();
    const [isLiked, setisLiked] = useState(false);

    const handleLike = () => {  //for liking and unliking posts
        if (!isLiked) {
            setisLiked(true)
        } else {
            setisLiked(false)
        }
    }

    let icon = "https://avatars.dicebear.com/api/identicon/" + username + ".svg";

    useEffect(() => {   //fetching data for logged in users

        setFullname(localStorage.getItem('fullname'));
        setUsername(localStorage.getItem('username'));
        document.title = "TwitClone: @" + localStorage.getItem('username'); //change DOCTITLE according to username.

    }, []);

    const wordCount = () => {   //live word counter
        document.getElementById("tweet").addEventListener('input', function () {
            var text = this.value,
                count = text.trim().replace(/\s+/g, ' ').length;

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

        }
        )
    }

    return (
        <div className="general">
            <div className="container App " >
                <div className="row " >

                    <Header />

                    <div className="col main-view  phone-home w-100 " >
                        <div className="row profile-header view">

                            <div className="p-2  col row " id="top">
                                <div className="ml-2 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div className="">
                                        <strong>Spicy Take</strong>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="p-2 view row" >
                            <div className="col-1.5">              {/* <--- user avi */}
                                <img src={icon} alt="example" className="user-logo" />
                            </div>
                            <div className="col user-name-tweet">                   {/* <--- user content */}
                                <div className=" ">
                                    <div>
                                        <strong>{fullname}</strong>
                                    </div>
                                    <span>@{username}</span>
                                </div>

                                <p style={{ fontSize: "26px" }} className=" ">this is my first tweet</p>

                                <div className="post-data ">
                                    <div className="view ">
                                        <span >date goes here</span>
                                    </div>

                                    <div className="view mt-3">
                                        <span >x comments</span> &nbsp; <span className="col ">x likes</span>
                                    </div>

                                    <div className="interact-row d-flex mt-3">
                                        <button className="comment col">
                                            <FontAwesomeIcon icon={faComment} size="2x" />
                                        </button>

                                        <button
                                            className="like col"
                                            onClick={handleLike}
                                        >
                                            {isLiked ? (
                                                <FontAwesomeIcon icon={heartSolid} size="2x" className="text-danger" />
                                            ) : <FontAwesomeIcon icon={faHeart} size="2x" />}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="p-2 post-view row mt-3">
                            <div className="col-1.5">              {/* <--- user avi */}
                                <img src={icon} alt="example" className="user-logo" />
                            </div>

                            <form className="signup col"  >
                                {/* onSubmit={(e) => handleSubmit(e)} */}
                                <div>
                                    <textarea
                                        id="tweet"
                                        name="tweet"
                                        type="text"
                                        // value={fullname}
                                        onChange={wordCount}
                                        className=" edit-input post-comment"
                                        maxLength="280"
                                        rows="3"
                                        placeholder="What's Your Reply?"
                                        required
                                    />
                                    {/* {Object.keys(fullnameErr).map((key) => {
                                        return <div style={{ color: "red" }} className="error-msg"> {fullnameErr[key]} </div>
                                    })} */}
                                    <div className="container counter">
                                        {/* {count}/280 */}
                                        <span id="show" className="word-count">0</span><span>/280</span>
                                    </div>
                                </div>

                                {/* {loading ? <Loading /> : null} */}

                                <button
                                    id="submit-btn"
                                    className="btn login-submit btn-outline-primary rounded-pill mt-4"
                                    type="submit"
                                // disabled={disabled}         //button disabler
                                >
                                    Tweet
                                </button>
                            </form>

                        </div>

                        <div className="p-2 view row mt-3">             {/* <--- standard tweet*/}
                            <div className="col-1.5">              {/* <--- user avi */}
                                <img src={icon} alt="example" className="user-logo" />
                            </div>
                            <div className="col user-name-tweet">                   {/* <--- user content */}
                                <div className="user-content">
                                    <strong>{fullname}</strong> &nbsp; <span>@{username}</span>
                                </div>
                                <p>this is my first tweet</p>

                                <Interactive />

                            </div>
                        </div>
                    </div>

                    <Sidebar />

                </div>
            </div>
        </div>

    );
}