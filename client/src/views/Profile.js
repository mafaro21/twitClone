import React, { useState, useEffect } from 'react';
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
// import Interactive from '../components/Interactive';
import deer from '../images/hari-nandakumar.jpg';
import axios from 'axios';
import Loader from "react-loader-spinner";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from 'react-time-ago'
// import { Redirect } from 'react-router-dom';

export default function Profile() {

    const [settingsModal, setSettingsModal] = useState(false);//settings modal
    const settingsToggle = () => setSettingsModal(!settingsModal);

    const [loading, setLoading] = useState(true);      // loading animation
    const [tweetLoading, setTweetLoading] = useState(true)

    const [fullname, setFullname] = useState();
    const [username, setUsername] = useState();
    const [bio, setBio] = useState();
    const [datejoined, setDatejoined] = useState();

    const [tweets, setTweets] = useState({ data: [] })// for displaying tweets and other info

    const [isLiked, setisLiked] = useState(false);

    const [tweetCount, setTweetCount] = useState(0)

    let icon = "https://avatars.dicebear.com/api/identicon/" + username + ".svg";


    const SettingsModal = () => {
        return <div>
            <div class="fade modaltest mt-5 modal-enter" >
                <div class="">
                    <div class="modal-view">
                        <div class="modal-header">
                            <h3 class="mt-3">Settings</h3>
                            <button className="" onClick={settingsToggle}>
                                <svg viewBox="0 0 24 24" class="icon ">
                                    <g>
                                        <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z">
                                        </path>
                                    </g>
                                </svg>
                            </button>
                        </div>

                        <div class="modal-body">
                            <form className=" signup"  >
                                {/* onSubmit={(e) => handleSubmit(e)} */}
                                <div>
                                    <input
                                        name="oldPass"
                                        type="password"
                                        // value={fullname}
                                        // onChange={(e) => setfullName(e.target.value)}
                                        className="signup-input change edit-modal"
                                        maxLength="20"
                                        placeholder="Enter Old Password"
                                        required
                                    />
                                    {/* {Object.keys(fullnameErr).map((key) => {
                                        return <div style={{ color: "red" }} className="error-msg"> {fullnameErr[key]} </div>
                                    })} */}
                                </div>

                                <div>
                                    <input
                                        name="newPassword"
                                        type="password"
                                        // value={password}
                                        // onChange={(e) => setPassword(e.target.value)}
                                        className="signup-input mt-1 change"
                                        maxLength="20"
                                        placeholder="Enter New Password"
                                        title="Required 8 characters or more"
                                        required
                                    />
                                    {/* {Object.keys(passwordErr).map((key) => {
                                        return <div style={{ color: "red" }} className="error-msg"> {passwordErr[key]} </div>
                                    })} */}
                                </div>

                                <div>
                                    <input
                                        name="confirmPass"
                                        type="password"
                                        // value={confirmPass}
                                        // onChange={(e) => setconfirmPass(e.target.value)}
                                        className="signup-input mt-1 change"
                                        maxLength="20"
                                        placeholder="Confirm New Password"
                                        required
                                    />
                                    {/* {Object.keys(confirmpasswordErr).map((key) => {
                                        return <div style={{ color: "red" }} className="error-msg"> {confirmpasswordErr[key]} </div>
                                    })} */}
                                </div>
                                <br />

                                {/* {loading ? <Loading /> : null} */}

                                <button
                                    id="submit-btn"
                                    className="btn login-submit btn-outline-primary rounded-pill mt-3"
                                    type="submit"
                                // disabled={disabled}         //button disabler
                                >
                                    Save
                        </button>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" onClick={settingsToggle} className="btn login-submit btn-primary rounded-pill mt-3">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    }

    const internalError = () => {       //redirect when there is a server error
        return window.location.replace("/Error");
    }

    useEffect(() => {   //fetching data for logged in users

        setFullname(localStorage.getItem('fullname'));
        setUsername(localStorage.getItem('username'));
        setBio(localStorage.getItem('bio'));
        setDatejoined(localStorage.getItem('datejoined'));
        document.title = "TwitClone: @" + localStorage.getItem('username'); //change DOCTITLE according to username.
        setLoading(false);

        axios.get("/tweets/mine/all")
            .then((res) => {
                setTweets(res)
                setTweetCount(res.data.length)
                console.log(res.data)
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    internalError();
                }
            })
            .finally(() => {
                setTweetLoading(false)
            })


    }, []); //tweets <-- this works but modal keeps refreshing


    const Loading = () => {        //the loading div

        return <div className="d-flex justify-content-center">
            <Loader type="TailSpin"
                color="orange"
                height={60}
                width={60}
            />

        </div>
    }

    const Logout = () => {  //logout function
        axios.get("/logout")
            .then((res) => {
                localStorage.clear();
                window.location.replace("/");

            })
    }

    const handleLike = () => {  //for liking and unliking posts
        // e.preventDefault
        // console.log(index)
        // if (!isLiked) {
        //     setisLiked(true)
        // } else {
        //     setisLiked(false)
        // }

        setisLiked(!isLiked)
    }


    TimeAgo.addLocale(en)

    return (
        <div className="general">
            <div className="container App " >
                <div className="row " >

                    <Header />
                    {settingsModal ? <SettingsModal /> : null}


                    <div className="col main-view  phone-home w-100 " >
                        {loading ? <Loading /> : null}
                        <div className="row profile-header view">

                            <div className="p-2  col row ">
                                <div className="ml-2 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div className="">
                                        <strong>{fullname}</strong>
                                    </div>
                                    <p><span>{tweetCount} Tweets</span></p>
                                </div>
                            </div>
                        </div>


                        <div className=" banner row" >
                            <img src={deer} alt="example" className="header-photo " />

                            <div className="p-2 profile-view col ">
                                <div className="">
                                    <img src={icon} alt="example" className="profile-logo" />

                                    <div className="banner-right ">
                                        <button
                                            className="btn login-submit banner-settings btn-outline-primary rounded-pill mt-1"
                                            type="submit"
                                            onClick={settingsToggle}
                                        >
                                            {/* banner-msg */}
                                            <svg viewBox="0 2 26 23" class="banner-msg">
                                                <g>
                                                    <path d="M12 8.21c-2.09 0-3.79 1.7-3.79 3.79s1.7 3.79 3.79 3.79 3.79-1.7 3.79-3.79-1.7-3.79-3.79-3.79zm0 6.08c-1.262 0-2.29-1.026-2.29-2.29S10.74 9.71 12 9.71s2.29 1.026 2.29 2.29-1.028 2.29-2.29 2.29z">
                                                    </path>
                                                    <path d="M12.36 22.375h-.722c-1.183 0-2.154-.888-2.262-2.064l-.014-.147c-.025-.287-.207-.533-.472-.644-.286-.12-.582-.065-.798.115l-.116.097c-.868.725-2.253.663-3.06-.14l-.51-.51c-.836-.84-.896-2.154-.14-3.06l.098-.118c.186-.222.23-.523.122-.787-.11-.272-.358-.454-.646-.48l-.15-.014c-1.18-.107-2.067-1.08-2.067-2.262v-.722c0-1.183.888-2.154 2.064-2.262l.156-.014c.285-.025.53-.207.642-.473.11-.27.065-.573-.12-.795l-.094-.116c-.757-.908-.698-2.223.137-3.06l.512-.512c.804-.804 2.188-.865 3.06-.14l.116.098c.218.184.528.23.79.122.27-.112.452-.358.477-.643l.014-.153c.107-1.18 1.08-2.066 2.262-2.066h.722c1.183 0 2.154.888 2.262 2.064l.014.156c.025.285.206.53.472.64.277.117.58.062.794-.117l.12-.102c.867-.723 2.254-.662 3.06.14l.51.512c.836.838.896 2.153.14 3.06l-.1.118c-.188.22-.234.522-.123.788.112.27.36.45.646.478l.152.014c1.18.107 2.067 1.08 2.067 2.262v.723c0 1.183-.888 2.154-2.064 2.262l-.155.014c-.284.024-.53.205-.64.47-.113.272-.067.574.117.795l.1.12c.756.905.696 2.22-.14 3.06l-.51.51c-.807.804-2.19.864-3.06.14l-.115-.096c-.217-.183-.53-.23-.79-.122-.273.114-.455.36-.48.646l-.014.15c-.107 1.173-1.08 2.06-2.262 2.06zm-3.773-4.42c.3 0 .593.06.87.175.79.328 1.324 1.054 1.4 1.896l.014.147c.037.4.367.7.77.7h.722c.4 0 .73-.3.768-.7l.014-.148c.076-.842.61-1.567 1.392-1.892.793-.33 1.696-.182 2.333.35l.113.094c.178.148.366.18.493.18.206 0 .4-.08.546-.227l.51-.51c.284-.284.305-.73.048-1.038l-.1-.12c-.542-.65-.677-1.54-.352-2.323.326-.79 1.052-1.32 1.894-1.397l.155-.014c.397-.037.7-.367.7-.77v-.722c0-.4-.303-.73-.702-.768l-.152-.014c-.846-.078-1.57-.61-1.895-1.393-.326-.788-.19-1.678.353-2.327l.1-.118c.257-.31.236-.756-.048-1.04l-.51-.51c-.146-.147-.34-.227-.546-.227-.127 0-.315.032-.492.18l-.12.1c-.634.528-1.55.67-2.322.354-.788-.327-1.32-1.052-1.397-1.896l-.014-.155c-.035-.397-.365-.7-.767-.7h-.723c-.4 0-.73.303-.768.702l-.014.152c-.076.843-.608 1.568-1.39 1.893-.787.326-1.693.183-2.33-.35l-.118-.096c-.18-.15-.368-.18-.495-.18-.206 0-.4.08-.546.226l-.512.51c-.282.284-.303.73-.046 1.038l.1.118c.54.653.677 1.544.352 2.325-.327.788-1.052 1.32-1.895 1.397l-.156.014c-.397.037-.7.367-.7.77v.722c0 .4.303.73.702.768l.15.014c.848.078 1.573.612 1.897 1.396.325.786.19 1.675-.353 2.325l-.096.115c-.26.31-.238.756.046 1.04l.51.51c.146.147.34.227.546.227.127 0 .315-.03.492-.18l.116-.096c.406-.336.923-.524 1.453-.524z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </button>
                                        <Link
                                            to="/edit"
                                            className="btn login-submit banner-edit btn-outline-primary rounded-pill mt-1"
                                            type="submit"
                                        // onClick={editToggle}
                                        >
                                            Edit Profile
                                        </Link>

                                    </div>


                                </div>

                                <div className="p-2 col">
                                    <div className="banner-right">
                                        <button
                                            className="btn login-submit banner-edit btn-outline-primary rounded-pill"
                                            type="submit"
                                            onClick={Logout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                    <strong>{fullname}</strong>
                                    <p><span>@{username}</span></p>

                                    <div>
                                        {bio}
                                    </div>
                                    <div>
                                        <span>
                                            <svg viewBox="0 0 24 24" class="bio-icon">
                                                <g>
                                                    <path d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z">
                                                    </path>
                                                    <circle cx="7.032" cy="8.75" r="1.285"></circle>
                                                    <circle cx="7.032" cy="13.156" r="1.285"></circle>
                                                    <circle cx="16.968" cy="8.75" r="1.285"></circle>
                                                    <circle cx="16.968" cy="13.156" r="1.285"></circle>
                                                    <circle cx="12" cy="8.75" r="1.285"></circle>
                                                    <circle cx="12" cy="13.156" r="1.285"></circle>
                                                    <circle cx="7.032" cy="17.486" r="1.285"></circle>
                                                    <circle cx="12" cy="17.486" r="1.285"></circle>
                                                </g>
                                            </svg>
                                            &nbsp;
                                            Joined {datejoined}
                                        </span>
                                    </div>
                                    <div>
                                        0 &nbsp;<span>Following</span> &nbsp;&nbsp;&nbsp; 0 &nbsp;<span>Followers</span>
                                    </div>

                                </div>
                            </div>
                        </div>


                        {tweetLoading ? <Loading /> : null}
                        {tweets.data.map(item => (
                            <div className="p-2 view row" key={item._id}>             {/* <--- standard tweet*/}
                                <div className="col-1.5">              {/* <--- user avi */}
                                    <img src={icon} alt="example" className="user-logo" />
                                    <div className="show-detail p-3 ">
                                        <div>
                                            <img src={icon} alt="example" className="user-logo " />
                                        </div>
                                        <div className="show-detail-1">
                                            <div >
                                                <strong>{fullname}</strong>
                                            </div>
                                            <div>
                                                <span>@{username}</span>
                                            </div>
                                            <div className="mt-2">
                                                {bio}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col user-name-tweet" >      {/* <--- user content */}
                                    <Link to={`/post/${item._id}`} className="post-link" >
                                        <div className="user-content">
                                            <strong>{fullname}</strong> &nbsp; <span>@{username}</span>
                                            &nbsp; <span>·</span> &nbsp;
                                            <span>
                                                <ReactTimeAgo date={item.dateposted} locale="en-US" timeStyle="twitter" />
                                            </span>
                                        </div>
                                        <p>{item.content}</p>
                                    </Link>

                                    <div className="interact-row d-flex ">
                                        <button className="comment col">
                                            <FontAwesomeIcon icon={faComment} />
                                            &nbsp; {item.comments}
                                        </button>

                                        <button
                                            className="like col"
                                            onClick={handleLike}
                                        >
                                            {isLiked ? (
                                                <FontAwesomeIcon icon={heartSolid} className="text-danger" />
                                            ) : <FontAwesomeIcon icon={faHeart} />}
                                                &nbsp; {item.likes}
                                        </button>

                                        <button className="col delete">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>

                                    </div>

                                </div>
                            </div>
                        ))}





                    </div>



                    <Sidebar />
                </div>
            </div >
        </div >
    );
}
