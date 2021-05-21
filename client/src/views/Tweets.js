import React, { useState, useEffect, useContext } from 'react'
// import NoAccount from '../components/NoAccount';
import Interactive from '../components/Interactive';
import axios from 'axios';
import Loader from "react-loader-spinner";
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
// import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
// import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
// import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
// import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart';
// import TimeAgo from 'javascript-time-ago';
// import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import { UserContext } from '../Contexts/UserContext';

export default function Tweets({ tweetCountFromTweets, IDtoTweets, username, fullname }) {
    const [loggedIn] = useContext(UserContext)


    const [tweetLoading, setTweetLoading] = useState(true);
    const [noTweets, setNoTweets] = useState(false);

    // const [disabled, setDisabled] = useState(false);
    const [tweetCount, setTweetCount] = useState(0);
    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets
    const [userNotFound, setUserNotFound] = useState(false)
    const [sessionName, setSessionName] = useState('')
    const [childData, setchildData] = useState(false)   //boolean from interactve.js on whether to refresh data
    const { user } = useParams()
    let history = useHistory()

    let icon = "https://avatars.dicebear.com/api/identicon/" + user + ".svg";

    let location = useLocation()
    let path = location.pathname
    let path1 = path.split('/u/')
    let userPath = path1[1]


    useEffect(() => {   //fetching data for logged in users


        // if (loggedIn === true) {
        //     axios.get("/tweets/mine/all")
        //         .then((res) => {
        //             setTweets(res);
        //             setTweetCount(res.data.length);
        //             console.log(res.data)
        //         })
        //         .catch((error) => {
        //             console.error(error)
        //             if (error.response.status === 500) {
        //                 internalError();
        //             } else if (error.response.status === 404) {
        //                 setNoTweets(true)
        //             }
        //         }).finally(() => {
        //             setTweetLoading(false)
        //         })
        // } else {

        setTweets({ data: [] }) //refresh tweets state when going to another user's profile


        setTweetLoading(true)

        IDtoTweets && axios.get(`/tweets/user/${IDtoTweets}`) //fetching all tweets from a given user
            .then((res) => {
                setTweets(res);
                setNoTweets(false)
                tweetCountFromTweets(res.data.length);
                console.log(res.data);
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
        // }



    }, [user, IDtoTweets]);

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };

    function UpdateData() {


        IDtoTweets && axios.get(`/tweets/user/${IDtoTweets}`) //fetching all tweets from a given user
            .then((res) => {
                setTweets(res);
                setNoTweets(false)
                console.log(res.data);
                // console.log(x)
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setNoTweets(true);
                }
            })
    }


    if (childData) {
        UpdateData()
        setchildData(false)
    }

    const NoTweets = () => {        //only shown when user has no tweets
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>This user hasn't made any tweets yet</span>

        </div>;
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

    return (
        <div>
            {noTweets ? <NoTweets /> : null}
            {tweetLoading ? <Loading /> : null}
            {tweets.data.map((item) => (
                <div className="p-2 view row main-post-div modal-enter" key={item._id}>
                    {/* {disableDiv[item._id] ? "p-2 view row main-post-div test" : "p-2 view row main-post-div"} */}
                    {userNotFound ? null :
                        <div className="col-1.5">              {/* <--- user avi */}
                            <Link
                                to={`/u/${username}`}
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
                                        to={`/u/${username}`}
                                        className="name-link"
                                    >
                                        <strong >{fullname}</strong>&nbsp;
                                            </Link>
                                    <span>@{username}</span>

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
                                username={username}
                                session={sessionName}
                                id={item._id}
                                comments={item.comments}
                                retweets={item.retweets}
                                likes={item.likes}
                                likesByMe={item.isLikedbyme}
                                passChildData={setchildData}
                                retweetsByMe={item.isRetweetbyme}
                            />
                        </Link>
                    }
                </div>
            ))}
        </div>
    )
}
