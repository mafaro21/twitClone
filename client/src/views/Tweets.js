import React, { useState, useEffect, useContext } from 'react'
import NoAccount from '../components/NoAccount';
import Interactive from '../components/Interactive';
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

export default function Tweets({ fromHeader }) {

    const [profile, setProfile] = useState([{ fullname: '', username: '', bio: '', followers: 0, following: 0, isfollowedbyme: false }])  //display user data
    const [datejoined, setDatejoined] = useState('');
    const [tweetLoading, setTweetLoading] = useState(true);

    const [disabled, setDisabled] = useState(false);
    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets
    const [userNotFound, setUserNotFound] = useState(false)
    const [sessionName, setSessionName] = useState('')
    const [childData, setchildData] = useState(false)   //boolean from interactve.js on whether to refresh data
    const { user } = useParams()
    let history = useHistory()

    const [tweetFromHeader, setTweetFromHeader] = useState(fromHeader)

    let icon = "https://avatars.dicebear.com/api/identicon/" + user + ".svg";

    let location = useLocation()
    let path = location.pathname
    let path1 = path.split('/u/')
    let userPath = path1[1]

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };

    function getData() {
        axios.get(`/profile/user/${user}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0]);
                // setUserID(res.data[0]._id);
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

            axios.get(`/tweets/user/${x}`) //fetching all tweets from a given user
                .then((res) => {
                    setTweets(res);
                    // setTweetCount(res.data.length);
                    // console.log(res.data);
                    // console.log(x)
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response.status === 500) {
                        internalError();
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

        setTweetFromHeader(fromHeader)

    }, [user, fromHeader]);

    if (tweetFromHeader) {
        getData()
        setTweetFromHeader(null)
    }

    console.log(tweetFromHeader)

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

    return (
        <div>
            {tweetLoading ? <Loading /> : null}
            {tweets.data.map((item) => (
                <div className="p-2 view row main-post-div" key={item._id}>
                    {/* {disableDiv[item._id] ? "p-2 view row main-post-div test" : "p-2 view row main-post-div"} */}
                    {userNotFound ? null :
                        <div className="col-1.5">              {/* <--- user avi */}
                            <Link
                                to={`/u/${profile.username}`}
                            >
                                <img src={icon} alt="example" className="user-logo" />
                            </Link>

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

                            {/* <div className="interact-row d-flex ">
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

                            </div> */}

                            <Interactive
                                className="mt-2"
                                session={sessionName}
                                id={item._id}
                                comments={item.comments}
                                retweets={item.retweets}
                                likes={item.likes}
                                likesByMe={item.isLikedbyme}
                            // fromHeader={setchildData}
                            />
                        </Link>
                    }
                </div>
            ))}
        </div>
    )
}
