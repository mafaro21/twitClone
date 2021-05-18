import React, { useState, useEffect, useContext } from 'react'
// import BackButton from '../components/BackButton';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import NoAccount from '../components/NoAccount';
// import deer from '../images/linus2.jpg';
// import unf1 from '../images/unf1.jpg';
// import unf2 from '../images/unf2.jpg';
import axios from 'axios';
import Loader from "react-loader-spinner";
import { useParams, useHistory, useLocation } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
// import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
// import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
// import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
// import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
// import ReactTimeAgo from 'react-time-ago';
import { UserContext } from '../Contexts/UserContext';

export default function Likes() {
    let location = useLocation()
    let history = useHistory()
    const { user } = useParams()
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
                setUserID(res.data[0]._id);
                getTweets(res.data[0]._id);
                // console.log(res.data)
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

            axios.get(`/likes/${x}`) //fetching all tweets from a given user
                .then((res) => {
                    setTweets(res);
                    console.log(res.data);
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
        <>
            {tweets.data.map((item) => {
                // console.log(item.ogtweet[0])
                console.log(item.oguser[0])
                return <div className="p-2 view row main-post-div" >

                    <div className="col-1.5">

                        <img src={icon} alt="example" className="user-logo" />
                    </div>



                    <div className="col user-name-tweet post-div" >
                        <div  >
                            <div >
                                <div
                                    className="name-link"
                                >
                                    {/* <strong >{item.oguser[0].fullname}</strong>&nbsp; */}
                                </div>
                                {/* <span>{item.oguser[0].username}</span> */}

                        &nbsp; <span>·</span> &nbsp;
                        <span>
                                    {/* <ReactTimeAgo date={item.ogtweet[0].dateposted} locale="en-US" timeStyle="twitter" /> */}
                                </span>
                            </div>

                            <div className="post-link">
                                {/* <p>{item.ogtweet[0].content} </p> */}
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </>



    )
}
