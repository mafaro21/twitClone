import React, { useState, useEffect, useRef } from 'react';
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
// import Interactive from '../components/Interactive';
import OutsideClick from '../components/OutsideClick';
import deer from '../images/paul-carmona.jpg';
import unf1 from '../images/unf1.jpg';
import unf2 from '../images/unf2.jpg';
import axios from 'axios';
import Loader from "react-loader-spinner";
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';

export default function Profile() {

    // const [loading, setLoading] = useState(true);      // loading animation
    const [tweetLoading, setTweetLoading] = useState(true);

    const [datejoined, setDatejoined] = useState("");

    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets 

    const [profile, setProfile] = useState({ fullname: '', username: '', bio: '', followers: 0, following: 0 })  //display user data

    const [likedTweets, setLikedTweets] = useState({}); // FOR HANDLING LIKES state

    const [tweetCount, setTweetCount] = useState(0);

    const [tweetId, setTweetId] = useState("");

    const [noTweets, setNoTweets] = useState(false);

    const [commentModal, setCommentModal] = useState(false);

    const [dots, setDots] = useState({});

    const [dotsModal] = useState(false);

    const [userID, setUserID] = useState('')

    const [hoverDiv, setHoverDiv] = useState(false)

    const [userNotFound, setUserNotFound] = useState(false)

    const [sessionName, setSessionName] = useState('')

    const { user } = useParams()

    let icon = "https://avatars.dicebear.com/api/identicon/" + user + ".svg";

    let history = useHistory()

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };


    useEffect(() => {   //fetching data for logged in users

        (() => {
            axios.get("/statuslogin")
                .then((res) => {
                    setSessionName(res.data.user)
                });
        })();

        axios.get(`/profile/user/${user}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data)
                // console.log(res.data)
                let date = new Date(res.data.datejoined);
                let months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                let finalDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
                setDatejoined(finalDate)
                let x = res.data._id
                getTweets(x)
                setUserID(x)
                document.title = `TwitClone: @${user}`
            })
            .catch((error) => {
                console.error(error)

                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setTweetLoading(false);
                    setUserNotFound(true)
                    document.title = `TwitClone - User Not Found!!`
                    // Error(user);
                }
            });


        async function getTweets(x) {
            setTweetLoading(true)
            axios.get(`/tweets/user/${x}`) //fetching all tweets from a given user
                .then((res) => {
                    setTweets(res);
                    setTweetCount(res.data.length);
                    // console.log(res.data);
                    // console.log(x)
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response.status === 500) {
                        internalError();
                    } else if (error.response.status === 404) {
                        setNoTweets(true);
                    }
                }).finally(() => {
                    setTweetLoading(false);
                });
        }

    }, [user]); //tweets <-- this works but modal keeps refreshing


    const Loading = () => {        //the loading div

        return <div className="d-flex justify-content-center">
            <Loader type="TailSpin"
                color="orange"
                height={60}
                width={60}
            />

        </div>;
    };

    const handleLike = (e, id, likedbyme) => {
        //for liking and unliking posts
        // NOW WORKS 🎉🎉
        //REFER: https://stackoverflow.com/questions/54853444/how-to-show-hide-an-item-of-array-map

        e.preventDefault()
        console.log(likedbyme)

        if (!likedTweets[id] && !likedbyme) {
            setDisabled(true);
            setLikedTweets(prevTweets => ({
                ...prevTweets,
                [id]: !setLikedTweets[id],
            }));

            axios.post(`/likes/${id}`)
                .then((res) => {
                    console.log(res.data);
                    UpdateData()
                })
                .catch((error) => {
                    console.error(error);
                }).finally(() => {
                    setDisabled(false);
                });

        } else {
            setDisabled(true);
            setLikedTweets(prevTweets => ({
                ...prevTweets,
                [id]: setLikedTweets[id]
            }));

            axios.delete(`/likes/${id}`)
                .then((res) => {
                    console.log(res.data);
                    UpdateData()
                })
                .catch((error) => {
                    console.error(error);
                }).finally(() => {
                    setDisabled(false);
                });
        }
        // console.log("Liked tweetid", id);
        // console.log(likedTweets);
    };

    const handleDelete = (e, id) => {
        e.preventDefault()
        // return alert(id)

        axios.delete(`/tweets/${id}`)
            .then((res) => {
                console.log(res.data);
                UpdateData()
            })
            .catch((error) => {
                console.log(id)
                console.error(error);
            });
    };


    const NoTweets = () => {        //only shown when user has no tweets
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>This user hasn't made any tweets yet</span>

        </div>;
    };

    const Dots = (id) => {

        setTweetId(id);   //set tweetid whenever the dots are clicked

        if (!dots[id]) {
            setDots(prevDots => ({
                ...prevDots,
                [id]: !setDots[id]

            }));
            console.log(id);
        }
    };

    const ref = useRef();   //clicking outside closes modal

    OutsideClick(ref, () => {
        // setDots(!dots)
        // console.log("yep cock");
    });

    const DotsModal = () => {       //three dots basically 'more'
        return <div className="dots-wrapper" ref={ref}>
            <div className="dots " >
                <button className="p-3 dots-delete " onClick={handleDelete}>
                    <div className="dots-button"><FontAwesomeIcon icon={faTrashAlt} /> Delete</div>
                </button>
                <button className="p-3 dots-delete ">
                    <div className="dots-button" >THIS DOES NOTHING </div>
                </button>
            </div>
        </div >;
    };


    const wordCount = () => {   //live word counter
        document.getElementById("tweet").addEventListener('input', function () {
            var text = this.value,
                count = text.trim().replace(/\s/g, '').length;

            if (count === 280) {
                document.getElementById('show').style.color = "red";
            } else if (count >= 250) {
                document.getElementById('show').style.color = "#FF8000";
            } else if (count >= 200) {
                document.getElementById('show').style.color = "#FFB400";
            } else if (count >= 150) {
                document.getElementById('show').style.color = "#FFF800";
            } else {
                document.getElementById('show').style.color = "grey";
            }

            if (count <= 0) {// used to disable button if textarea is empty
                document.getElementById("submit-btn").disabled = true;
            } else {
                document.getElementById("submit-btn").disabled = false;
            }

            document.getElementById('show').textContent = count;

        });
    };

    const CommentModal = () => {
        return <div >
            {/* ref={ref} */}
            <div className="modal-wrapper" >
                <div className="tweettest  modal-enter" >
                    <div className="">
                        <div className="modal-view">
                            <div className="modal-header">
                                <button className="" onClick={() => setCommentModal(false)}>
                                    <svg viewBox="0 0 24 24" className="icon ">
                                        <g>
                                            <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z">
                                            </path>
                                        </g>
                                    </svg>
                                </button>
                            </div>

                            <div style={{ color: "red" }} className="error-msg ">{ }</div>

                            <div className="modal-body row">
                                <div className="col-1">
                                    <img src={icon} alt="example" className="user-tweet-img" />
                                </div>

                                <form id="tweetForm" className="signup col" >

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
                        </div>
                    </div>
                </div>
            </div>
        </div >;
    };

    const UpdateData = () => {  //update data after like or deleted tweet
        axios.get(`/tweets/user/${userID}`)
            .then((res) => {
                setTweets(res);
                setTweetCount(res.data.length);
                // console.log(res.data);
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setNoTweets(true);
                }
            }).finally(() => {
                setTweetLoading(false);
            });
    }

    const HoverDiv = (id) => {

        setTimeout(() => {
            if (!hoverDiv[id]) {
                setHoverDiv(prevHoverDiv => ({
                    ...prevHoverDiv,
                    [id]: !setHoverDiv[id]
                }));
            }
        }, 700);

        return <div className="show-detail p-3 ">
            <div>
                <img src={icon} alt="example" className="user-logo " />
            </div>
            <div className="show-detail-1 ">
                <div >
                    <strong>{profile.fullname}</strong>
                </div>
                <div>
                    <span>@{profile.username}</span>
                </div>
                <div className="mt-2 ">
                    {profile.bio}
                </div>
                <div className="mt-1">
                    <span style={{ fontWeight: 700 }}>{profile.following}</span>&nbsp;<span>Following</span>
                        &nbsp;&nbsp;&nbsp;
                    <span style={{ fontWeight: 700 }}>{profile.followers}</span> &nbsp;<span>Followers</span>
                </div>
            </div>

        </div>

    }

    const UserNotFound = () => {
        return <div className="d-flex justify-content-center p-2">
            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}> {user}?, never heard of them... </span>
        </div>
    }

    const handleFollow = () => {
        console.log(userID)

        axios.post(`/follows/${userID}`)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.error(err)
            })

    }

    const handleUnfollow = () => {
        axios.delete(`/follows/${userID}`)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }



    let location = useLocation()
    let path = location.pathname
    let path1 = path.split('/u/')
    let userPath = path1[1]

    TimeAgo.addLocale(en);   //for the time ago

    return (
        <div className="App general" >
            <Navbar />
            <div className="container  " >
                <div className="row " >

                    <Header />
                    {commentModal ? <CommentModal /> : null}

                    <div className="col main-view phone-home " >
                        {/* {loading ? <Loading /> : null} */}

                        <div className={window.scrollY > 0 ? "row profile-header view" : "row profile-header-scroll view"}>

                            <div className="p-2  col row ">
                                <div className="ml-2 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div >
                                        <strong className="text">{userNotFound ? "Profile" : profile.fullname}</strong>
                                    </div>
                                    <p><span>{userNotFound ? null : tweetCount}  {userNotFound ? null : tweetCount === 1 ? "Tweet" : "Tweets"} </span></p>
                                </div>
                            </div>
                        </div>


                        <div className=" banner row" >
                            <img src={!userNotFound ? deer : unf2} alt="example" className="header-photo " />

                            <div className="p-2 profile-view col ">
                                <div className="">
                                    <img src={!userNotFound ? icon : unf1} alt="example" className="profile-logo" />

                                    <div className="banner-right ">

                                        {userNotFound ? null :
                                            sessionName === userPath ?
                                                <Link
                                                    to={`/u/${profile.username}/edit`}
                                                    className="btn login-submit banner-edit btn-outline-primary rounded-pill mt-1"
                                                    type="submit"
                                                // onClick={editToggle}
                                                >
                                                    Edit Profile
                                                </Link>
                                                :
                                                <div className="banner-right" onClick={() => handleFollow()}>
                                                    <button
                                                        className="btn login-submit banner-edit btn-outline-primary rounded-pill mt-1"
                                                        type="submit"
                                                    >
                                                        Follow
                                                    </button>
                                                </div>

                                            // <div className="banner-right" onClick={() => handleUnfollow()}>
                                            //     <button
                                            //         className="btn login-submit banner-edit btn-primary rounded-pill mt-1"
                                            //         type="submit"
                                            //     >
                                            //         Following
                                            //     </button>
                                            // </div>
                                        }

                                    </div>


                                </div>

                                <div className="p-2 col">

                                    <strong style={{ fontWeight: 700 }}>{userNotFound ? `@${user}` : profile.fullname}</strong>
                                    <p><span >{userNotFound ? null : `@${profile.username}`}</span></p>

                                    <div className="mt-1">
                                        {profile.bio}
                                    </div>

                                    {userNotFound ? null :
                                        <div className="mt-1">
                                            <span>
                                                <svg viewBox="0 0 24 24" className="bio-icon">
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
                                    }

                                    {userNotFound ? null :
                                        <div className="mt-1">
                                            <span style={{ fontWeight: 700 }}>{profile.following}</span>&nbsp;<span>Following</span>
                                        &nbsp;&nbsp;&nbsp;
                                        <span style={{ fontWeight: 700 }}>{profile.followers}</span> &nbsp;<span>Followers</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        {userNotFound ? <UserNotFound /> : null}
                        {noTweets ? <NoTweets /> : null}
                        {tweetLoading ? <Loading /> : null}
                        {tweets.data.map((item) => (
                            <div className="p-2 view row main-post-div" key={item._id}>
                                {userNotFound ? null :
                                    <div className="col-1.5">              {/* <--- user avi */}
                                        <Link
                                            to={`/u/${profile.username}`}
                                            onMouseEnter={() => HoverDiv(item._id)}
                                            onMouseLeave={() => setHoverDiv(false)}
                                        >
                                            <img src={icon} alt="example" className="user-logo" />
                                        </Link>

                                        {hoverDiv[item._id] ? <HoverDiv /> : null}
                                    </div>
                                }

                                {userNotFound ? null :
                                    <Link to={`/post/${item._id}`} className="col user-name-tweet post-div" >
                                        {/* <--- user content */}
                                        <div  >
                                            <div >
                                                <Link
                                                    to={`/u/${profile.username}`}
                                                    className="name-link"
                                                    onMouseEnter={() => HoverDiv(item._id)}
                                                    onMouseLeave={() => setHoverDiv(false)}
                                                >
                                                    <strong >{profile.fullname}</strong>&nbsp;
                                            </Link>
                                                <span>@{profile.username}</span>

                                            &nbsp; <span>·</span> &nbsp;
                                            <span>
                                                    <ReactTimeAgo date={item.dateposted} locale="en-US" timeStyle="twitter" />
                                                </span>
                                                {dots[item._id] ? <DotsModal /> : null}
                                                {dotsModal ? <DotsModal /> : null}
                                                {/* <span className="three-dots" onClick={() => Dots(item._id)}>
                                                <svg viewBox="0 0 24 24" className="post-menu">
                                                    <g>
                                                        <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle>
                                                    </g>
                                                </svg>
                                            </span> */}
                                            </div>

                                            <div className="post-link ">
                                                <p>{item.content}</p>
                                            </div>
                                        </div>

                                        <div className="interact-row d-flex ">
                                            <button
                                                className="comment col"
                                                onClick={() => setCommentModal(true)}
                                            >
                                                <FontAwesomeIcon icon={faComment} />
                                            &nbsp; {item.comments}
                                            </button>

                                            <button className="col retweet">
                                                <FontAwesomeIcon icon={faRetweet} />
                                            </button>

                                            <button
                                                className="like col"
                                                onClick={(e) => handleLike(e, item._id, item.isLikedbyme)}
                                                disabled={disabled}

                                            >
                                                {likedTweets[item._id] || item.isLikedbyme ?
                                                    (<FontAwesomeIcon icon={heartSolid} className="text-danger" />)
                                                    : <FontAwesomeIcon icon={faHeart} />
                                                }

                                                &nbsp; {item.likes}
                                            </button>

                                            <button
                                                className="col delete"
                                                onClick={(e) => handleDelete(e, item._id)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </div>

                                    </Link>
                                }
                            </div>
                        ))}





                    </div>



                    <Sidebar />
                </div>
            </div >
        </div >
    );
}