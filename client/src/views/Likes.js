import React, { useState, useEffect, useContext } from 'react'
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NoAccount from '../components/NoAccount';
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

export default function Retweets() {
    let location = useLocation()
    let history = useHistory()
    const { user } = useParams()
    const msg = useContext(UserContext)
    TimeAgo.addLocale(en);   //for the time ago

    let path = location.pathname
    let path1 = path.split('/u/' && '/likes')
    let userPath = path1[1]

    const [tweetLoading, setTweetLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [profile, setProfile] = useState([{ fullname: '', username: '', bio: '', followers: 0, following: 0, isfollowedbyme: false }])  //display user data

    const [tweetCount, setTweetCount] = useState(0);
    const [userNotFound, setUserNotFound] = useState(false)
    const [datejoined, setDatejoined] = useState('');
    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets
    const [noTweets, setNoTweets] = useState(false);
    const [userID, setUserID] = useState('')
    const [noAccountDiv, setNoAccountDiv] = useState(false)
    const [sessionName, setSessionName] = useState('')

    let icon = "https://avatars.dicebear.com/api/identicon/" + user + ".svg";

    useEffect(() => {   //fetching data for logged in users

        axios.get(`/profile/user/${user}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0]);
                let x = res.data[0]._id;
                setUserID(x);
                getTweets(x);
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

    }, [user]);

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };
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
    const NoTweets = () => {        //only shown when user has no tweets
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>This user hasn't made any tweets yet</span>

        </div>;
    };
    const UpdateData = () => {  //update data after like or deleted tweet
        axios.get(`/profile/user/${user}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0])
                // console.log(res.data)
                let date = new Date(res.data[0].datejoined);
                let months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                let finalDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
                setDatejoined(finalDate)
                document.title = `TwitClone - @${user}`
            })
            .catch((error) => {
                console.error(error)

                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setUserNotFound(true)
                    document.title = `TwitClone - User Not Found!!`
                    // Error(user);
                }
            });

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
            });


    }
    const UserNotFound = () => {
        return <div className="d-flex justify-content-center p-2">
            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}> {user}?, never heard of them... </span>
        </div>
    }

    const handleFollow = () => {
        setDisabled(true)
        axios.post(`/follows/${userID}`)
            .then((res) => {
                UpdateData()
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
                UpdateData()
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

    let path0 = location.pathname
    let path5 = path0.split(`/u/${profile.username}`)
    let finalPath = path5[1]

    return (
        <div className="App general" >
            {/* <Navbar /> */}
            <div className="container  " >
                <div className="row " >
                    {noAccountDiv ? <NoAccount currentState={noAccountDiv} /> : null}

                    <Header />

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
                                            <Link to={`/u/${profile.username}`} className={finalPath === '' ? "w-35 follow-tab-active" : "w-35 follow-tab"} style={{ width: '33.3%' }}>
                                                <div className="p-3 ">
                                                    Tweets
                                                </div>
                                            </Link>
                                            <Link to={`/u/${profile.username}/retweets`} className={finalPath === '/retweets' ? "w-35 follow-tab-active" : "w-35 follow-tab"} style={{ width: '33.3%' }}>
                                                <div className="p-3 ">
                                                    Retweets
                                                </div>
                                            </Link>
                                            <div className={finalPath === '/likes' ? "w-35 follow-tab-active" : "w-35 follow-tab"} style={{ width: '33.3%' }}>
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

                    </div>


                    <Sidebar />
                </div>
            </div>
        </div>
    )
}
