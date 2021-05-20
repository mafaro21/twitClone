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
import Interactive from '../components/Interactive';

export default function Retweets() {
    let location = useLocation()
    let history = useHistory()
    const { user } = useParams()
    const msg = useContext(UserContext)
    TimeAgo.addLocale(en);   //for the time ago

    let path = location.pathname
    let path1 = path.split('/u/' && '/retweets')
    let userPath = path1[1]

    const [tweetLoading, setTweetLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [profile, setProfile] = useState([{ fullname: '', username: '', bio: '', followers: 0, following: 0, isfollowedbyme: false }])  //display user data

    const [tweetCount, setTweetCount] = useState(0);
    const [userNotFound, setUserNotFound] = useState(false)
    const [datejoined, setDatejoined] = useState('');
    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets
    const [noRetweets, setNoRetweets] = useState(false);
    const [userID, setUserID] = useState('')
    const [noAccountDiv, setNoAccountDiv] = useState(false)
    const [sessionName, setSessionName] = useState('')
    const [childData, setchildData] = useState(false)   //boolean from interactve.js on whether to refresh data


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

        setTweets({ data: [] }) // this is to refresh the state to make sure someone else's retweets don't show up on another account
        async function getTweets(x) {
            setTweetLoading(true)

            axios.get(`/retweets/${x}`) //fetching all tweets from a given user
                .then((res) => {
                    setNoRetweets(false)
                    setTweets(res);
                    console.log(res.data);
                    // console.log(x)
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response.status === 500) {
                        internalError();
                    } else if (error.response.status === 404) {
                        setNoRetweets(true);
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
    const NoRetweets = () => {        //only shown when user has no tweets
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>This user hasn't made any retweets</span>

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
                    // setNoTweets(true);
                }
            });


    }

    let path0 = location.pathname
    let path5 = path0.split(`/u/${profile.username}`)
    let finalPath = path5[1]

    return (
        <>
            {tweetLoading ? <Loading /> : null}
            {noRetweets ? <NoRetweets /> : null}
            {tweets.data.map((item) => {
                // console.log(item.ogtweet[0])
                let icon = "https://avatars.dicebear.com/api/identicon/" + item.oguser[0].username + ".svg";


                return <div className="p-2 view row main-post-div" >

                    <div className="col-1.5">

                        <img src={icon} alt="example" className="user-logo" />
                    </div>



                    <div className="col user-name-tweet post-div" >
                        <div  >
                            <div >
                                <Link
                                    to={`/u/${item.oguser[0].username}`}
                                    className="name-link"
                                >
                                    <strong >{item.oguser[0].fullname}</strong>&nbsp;
                                </Link>
                                <span>@{item.oguser[0].username}</span>

                        &nbsp; <span>·</span> &nbsp;
                        <span>
                                    <ReactTimeAgo date={item.ogtweet[0].dateposted} locale="en-US" timeStyle="twitter" />
                                </span>
                            </div>

                            <div className="post-link">
                                <p>{item.ogtweet[0].content} </p>
                            </div>
                        </div>
                        <Interactive
                            className="mt-2"
                            // session={sessionName}
                            id={item._id}
                            comments={item.ogtweet[0].comments}
                            retweets={item.ogtweet[0].retweets}
                            likes={item.ogtweet[0].likes}
                            likesByMe={item.isLikedbyme}
                            passChildData={setchildData}
                            retweetsByMe={item.isRetweetbyme}
                            username={item.oguser[0].username}
                        />
                    </div>
                </div>
            })}
        </>
    )
}
