import React, { useState, useEffect, useRef, useContext } from 'react';
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NoAccount from '../components/NoAccount';
import Interactive from '../components/Interactive';
import OutsideClick from '../components/OutsideClick';
import Likes from './Likes';
import Retweets from './Retweets';
import Tweets from './Tweets';
import deer from '../images/linus2.jpg';
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
import { UserContext } from '../Contexts/UserContext';

export default function Profile() {

    const [tweetLoading, setTweetLoading] = useState(true);

    const [datejoined, setDatejoined] = useState('');

    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [disableDiv, setDisableDiv] = useState(false) //linethrough when axios is handling delete request for a tweet

    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets 

    const [profile, setProfile] = useState([{ fullname: '', username: '', bio: '', followers: 0, following: 0, isfollowedbyme: false }])  //display user data

    const [likedTweets, setLikedTweets] = useState({}); // FOR HANDLING LIKES state

    const [deleteTweet, setdeleteTweet] = useState({})

    const [retweetTweet, setRetweetTweet] = useState({})

    const [tweetCount, setTweetCount] = useState(0);

    const [noTweets, setNoTweets] = useState(false);

    const [commentModal, setCommentModal] = useState(false);

    const [userID, setUserID] = useState('')

    const [userNotFound, setUserNotFound] = useState(false)

    const [sessionName, setSessionName] = useState('')

    const [noAccountDiv, setNoAccountDiv] = useState(false) //shows modal that tells user they need to sign/log in

    const { user } = useParams()

    const [childData, setchildData] = useState(false)   //boolean from interactve.js on whether to refresh data

    const [showLike, setShowLike] = useState(false)    // test for showing likes page

    const [showTweets, setShowTweets] = useState(true)  //showing main tweets page, on refresh this always shows

    const [showRetweets, setShowRetweets] = useState(false)     //showing retweets

    let icon = "https://avatars.dicebear.com/api/identicon/" + user + ".svg";

    let history = useHistory()

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };

    function getData() {
        axios.get(`/profile/user/${user}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0]);
                setUserID(res.data[0]._id);
                getTweets(res.data[0]._id);
                // console.log(res.data)
                let date = new Date(res.data[0].datejoined);
                let finalDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(date);
                setDatejoined(finalDate);
                document.title = `TwitClone - @${user}`
                
            })
            .catch((error) => {

                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setTweetLoading(false);
                    setUserNotFound(true)
                    document.title = "TwitClone - User Not Found!!"
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
    }

    useEffect(() => {   //fetching data for logged in users

        (() => {
            axios.get("/statuslogin")
                .then((res) => {
                    setSessionName(res.data.user)
                });
        })();

        getData()

    }, [user]);


    const Loading = () => {

        let x = localStorage.getItem("accent") || 'grey'

        return <div className="accent d-flex justify-content-center ">
            <Loader type="TailSpin"
                color={x}
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
                    getData()
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem")

                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false)
                    }, 2000);
                });

        } else {
            setDisabled(true);
            setLikedTweets(prevTweets => ({
                ...prevTweets,
                [id]: setLikedTweets[id],
            }));

            axios.delete(`/likes/${id}`)
                .then((res) => {
                    console.log(res.data);
                    getData()
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem")
                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false)
                    }, 2000);
                });
        }
    };

    const handleDelete = (e, id) => {
        e.preventDefault()
        // return alert(id)
        setDisableDiv(true)

        if (!deleteTweet[id]) {
            setDisabled(true);
            setDisableDiv(prevDelete => ({
                ...prevDelete,
                [id]: !setDisableDiv[id],
            }));

            axios.delete(`/tweets/${id}`)
                .then((res) => {
                    console.log(res.data);
                    getData()
                })
                .catch((error) => {
                    console.log(id)
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem")

                })
                .finally(() => {
                    setTimeout(() => {
                        setNoAccountDiv(false)
                    }, 2000);
                    // setDisableDiv(false)
                    setDisabled(false);
                })
        }


    };

    const handleRetweet = (e, id) => {
        e.preventDefault()
        console.log(id)

        if (!retweetTweet[id]) {
            setDisabled(true);
            setRetweetTweet(prevRetweets => ({
                ...prevRetweets,
                [id]: !setRetweetTweet[id],
            }));

            axios.post(`/retweets/${id}`)
                .then((res) => {
                    console.log(res.data);
                    getData()
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("problem")

                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false)
                    }, 2000);
                });

        } else {
            setDisabled(true);
            setRetweetTweet(prevRetweets => ({
                ...prevRetweets,
                [id]: setRetweetTweet[id],
            }));

            axios.delete(`/retweets/${id}`)
                .then((res) => {
                    console.log(res.data);
                    getData()
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem")
                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false)
                    }, 2000);
                });
        }
    }

    const NoTweets = () => {        //only shown when user has no tweets
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>This user hasn't made any tweets yet</span>

        </div>;
    };


    const ref = useRef();   //clicking outside closes modal

    OutsideClick(ref, () => {
        // console.log("yep cock");
    });

    const UserNotFound = () => {
        return <div className="d-flex justify-content-center p-2">
            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}> {user}?, never heard of them... </span>
        </div>
    }

    const handleFollow = () => {
        setDisabled(true)
        axios.post(`/follows/${userID}`)
            .then((res) => {
                getData()
                console.log(res.data)
            })
            .catch((err) => {
                console.error(err)
                err.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem")
            })
            .finally(() => {
                setDisabled(false)
                setTimeout(() => {
                    setNoAccountDiv(false)
                }, 2000);
            })

    }

    const handleUnfollow = () => {
        setDisabled(true)
        axios.delete(`/follows/${userID}`)
            .then((res) => {
                getData()
                console.log(res.data)
            })
            .catch((err) => {
                console.error(err)
                err.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem")
            })
            .finally(() => {
                setDisabled(false)
                setTimeout(() => {
                    setNoAccountDiv(false)
                }, 2000);
            })
    }

    const FollowingLink = () => {
        if (sessionName) {
            history.push(`/u/${profile.username}/following`)
        } else {
            setNoAccountDiv(true)
            setTimeout(() => {
                setNoAccountDiv(false)
            }, 2000);
        }
    }

    const FollowerLink = () => {
        if (sessionName) {
            history.push(`/u/${profile.username}/followers`)
        } else {
            setNoAccountDiv(true)
            setTimeout(() => {
                setNoAccountDiv(false)
            }, 2000);
        }
    }

    // if (childData) {
    //     getData()
    //     setchildData(false)
    // }


    let location = useLocation()
    let path = location.pathname
    let path1 = path.split('/u/')
    let userPath = path1[1]

    TimeAgo.addLocale(en);   //for the time ago

    const msg = useContext(UserContext)

    let path0 = location.pathname
    let path5 = path0.split(`/u/${profile.username}`)
    let finalPath = path5[1]

    const likePage = () => {
        setShowLike(true)
        setShowTweets(false)
        setShowRetweets(false)
    }

    const tweetsPage = () => {
        setShowLike(false)
        setShowTweets(true)
        setShowRetweets(false)
    }

    const retweetsPage = () => {
        setShowTweets(false)
        setShowLike(false)
        setShowRetweets(true)
    }




    return (
        <div className="App general" >
            {/* <Navbar /> */}
            <div className="container  " >
                <div className="row " >

                    {noAccountDiv ? <NoAccount currentState={noAccountDiv} /> : null}

                    <Header passChildData={setchildData} />

                    <div className="col main-view phone-home " >
                        {/* {loading ? <Loading /> : null} */}

                        <div className="row profile-header view mt-1">

                            <div className=" col row ">
                                <div className="ml-2 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div >
                                        <strong className="text" style={{ fontSize: '20px' }}>{userNotFound ? "Profile" : profile.fullname} {msg}</strong>
                                    </div>
                                    {/* <p> */}
                                    <span style={{ fontSize: '15px' }}>{userNotFound ? null : tweetCount}  {userNotFound ? null : tweetCount === 1 ? "Tweet" : "Tweets"} </span>
                                    {/* </p> */}
                                </div>
                            </div>
                        </div>


                        <div className=" banner row" >
                            <img src={!userNotFound ? deer : unf2} alt="example" className="header-photo " />

                            <div className="p-2  col ">
                                <div className="">
                                    <img src={!userNotFound ? icon : unf1} alt="example" className="profile-logo" />

                                    <div className="banner-right ">

                                        {tweetLoading ? null :
                                            userNotFound ? null :
                                                sessionName === userPath ?
                                                    <Link
                                                        to={`/u/${profile.username}/edit`}
                                                        className="btn login-submit banner-edit btn-accent rounded-pill mt-1 "
                                                        type="submit"
                                                    // onClick={editToggle}
                                                    >
                                                        Edit Profile
                                                </Link>
                                                    :
                                                    profile.isfollowedbyme === true ?
                                                        <div className="banner-right" onClick={() => handleUnfollow()}>
                                                            <button
                                                                className="btn login-submit banner-edit btn-accent rounded-pill mt-1"
                                                                type="submit"
                                                                disabled={disabled}
                                                            >
                                                                Following
                                                        </button>
                                                        </div>
                                                        :
                                                        <div className="banner-right" onClick={() => handleFollow()}>
                                                            <button
                                                                className="btn login-submit banner-edit btn-accent-outline rounded-pill mt-1"
                                                                type="submit"
                                                                disabled={disabled}
                                                            >
                                                                Follow
                                                    </button>
                                                        </div>

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
                                        <div className="mt-1 d-flex">
                                            <div className="flw-flw" onClick={FollowingLink}><span style={{ fontWeight: 700 }}>{profile.following}</span>&nbsp;<span>Following</span></div>
                                            &nbsp;&nbsp;&nbsp;
                                            <div className="flw-flw" onClick={FollowerLink}><span style={{ fontWeight: 700 }}>{profile.followers}</span> &nbsp;<span>Followers</span></div>
                                        </div>
                                    }

                                    {userNotFound ? null :
                                        <div className="row d-flex view mt-3" style={{ textAlign: 'center', fontWeight: '700' }}>
                                            <div onClick={tweetsPage} className={showTweets ? "w-35 follow-tab-active" : "w-35 follow-tab"} style={{ width: '33.3%' }}>
                                                <div className="p-3 ">
                                                    Tweets
                                            </div>
                                            </div>
                                            <div onClick={retweetsPage} className={showRetweets ? "w-35 follow-tab-active" : "w-35 follow-tab"} style={{ width: '33.3%' }}>
                                                <div className="p-3 ">
                                                    Retweets
                                            </div>
                                            </div>
                                            <div onClick={likePage} className={showLike ? "w-35 follow-tab-active" : "w-35 follow-tab"} style={{ width: '33.3%' }}>
                                                {/* to={`/u/${profile.username}/likes`} */}
                                                {/* {finalPath === '/following' ? "w-35 follow-tab-active" : } */}
                                                <div className="p-3 ">
                                                    Likes
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        {userNotFound ? <UserNotFound /> : null}
                        {noTweets ? <NoTweets /> : null}
                        {/* {tweetLoading ? <Loading /> : null} */}
                        {showLike ? <Likes /> : null}
                        {showTweets ? <Tweets fromHeader={childData} /> : null}
                        {showRetweets ? <Retweets /> : null}

                        {/* {tweets.data.map((item) => (
                            <div className={disableDiv[item._id] ? "p-2 view row main-post-div test" : "p-2 view row main-post-div"} key={item._id}>
                                {userNotFound ? null :
                                    <div className="col-1.5">             
                                        <Link
                                            to={`/u/${profile.username}`}
                                        >
                                            <img src={icon} alt="example" className="user-logo" />
                                        </Link>

                                    </div>
                                }

                                {userNotFound ? null :
                                    <Link to={`/post/${item._id}`} className="col user-name-tweet post-div" >
                                        
                                        <div  >
                                            <div >
                                                <Link
                                                    to={`/u/${profile.username}`}
                                                    className="name-link"
                                                >
                                                    <strong >{profile.fullname}</strong>&nbsp;
                                            </Link>
                                                <span>@{profile.username}</span>

                                            &nbsp; <span>·</span> &nbsp;
                                            <span>
                                                    <ReactTimeAgo date={item.dateposted} locale="en-US" timeStyle="twitter" />
                                                </span>
                                            </div>

                                            <div className="post-link">
                                                <p>{item.content} </p>
                                            </div>
                                        </div>

                                        <div className="interact-row d-flex ">
                                            <button
                                                className={item.comments ? "comment-true col" : "comment col"}
                                            >
                                                <FontAwesomeIcon icon={faComment} />
                                            &nbsp; {item.comments}

                                            </button>

                                            <button
                                                className={item.isRetweetbyme ? "col retweet-true" : "col retweet"}
                                                onClick={(e) => handleRetweet(e, item._id)}
                                                disabled={disabled}
                                            >
                                                <FontAwesomeIcon icon={faRetweet} />
                                                &nbsp; {item.retweets}
                                            </button>

                                            <button
                                                className="like col"
                                                onClick={(e) => handleLike(e, item._id, item.isLikedbyme)}
                                                disabled={disabled}

                                            >
                                                {item.isLikedbyme ?
                                                    (<FontAwesomeIcon icon={heartSolid} className="text-danger" />)
                                                    : <FontAwesomeIcon icon={faHeart} />
                                                }

                                                &nbsp; {item.likes}
                                            </button>

                                            {sessionName === userPath ?
                                                <button
                                                    className="col delete"
                                                    onClick={(e) => handleDelete(e, item._id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                                :
                                                null
                                            }

                                        </div>

                                        <Interactive
                                            className="mt-2"
                                            session={sessionName}
                                            id={item._id}
                                            comments={item.comments}
                                            retweets={item.retweets}
                                            likes={item.likes}
                                            likesByMe={item.isLikedbyme}
                                            passChildData={setchildData}
                                        />
                                    </Link>
                                }
                            </div>
                        ))} */}

                    </div>

                    <Sidebar />
                </div>
            </div >
        </div >
    );
}