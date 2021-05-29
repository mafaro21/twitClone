import React, { useState, useContext } from 'react';
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import NoAccount from '../components/NoAccount';
import { UserContext } from '../Contexts/UserContext';


export default function Interactive({ id, comments, retweets, likes, likesByMe, passChildData, retweetsByMe, username, deleteID, justTrying }) {
    //most props are from profile.js

    const [user] = useContext(UserContext);
    const [likedTweets, setLikedTweets] = useState({}); // FOR HANDLING LIKES state
    const [serverError, setserverError] = useState(false);

    /** 
     * THESE 4 below ARE LOCAL states. (they depend on Props NOT SERVER)
     * They update the UI if Axios returns SUCCESS.
     * SO NO NEED OF FETCHING ALL THE tweets AGAIN from SERVER just for 1 update.
     * 
     * */
    const [likeCount, setLikeCount] = useState(parseInt(likes)); // local
    const [likedState, setLikedState] = useState(Boolean(likesByMe)); // local
    const [retweetCount, setRetweetCount] = useState(parseInt(retweets)); // local
    const [retweetState, setRetweetState] = useState(Boolean(retweetsByMe)); // local
    //------------------------------------------------------------------------

    const [deleteTweet, setdeleteTweet] = useState({});
    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [retweetTweet, setRetweetTweet] = useState({});
    const [noAccountDiv, setNoAccountDiv] = useState(false); //shows modal that tells user they need to sign/log in


    // let location = useLocation()
    // let path = location.pathname
    // let path1 = path.split('/u/')
    // let userPath = path1[1]


    const handleDelete = (e, id) => {
        e.preventDefault();
        console.log(id)

        if (!deleteTweet[id]) {
            setDisabled(true);
            setdeleteTweet(prevDelete => ({
                ...prevDelete,
                [id]: !setdeleteTweet[id],
            }));

            axios.delete(`/tweets/${id}`)
                .then((res) => {
                    console.log(res.data);
                    passChildData(true);
                    deleteID(id)
                    justTrying('testing')
                })
                .catch((error) => {
                    switch (error.response.status) {
                        case 401:
                            setNoAccountDiv(true);
                            break;
                        case 500:
                            setserverError(true);
                        default:
                            console.error(error);
                            break;
                    }
                }).finally(() => {
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                    setdeleteTweet(false);
                    setDisabled(false);
                });
        }
    };

    const handleLike = (e, id, likesByMe) => {
        //for liking and unliking posts
        // NOW WORKS 🎉🎉
        //REFER: https://stackoverflow.com/questions/54853444/how-to-show-hide-an-item-of-array-map

        e.preventDefault();
        // console.log(likedbyme)

        if (!likesByMe && !likedTweets[id]) {
            setDisabled(true);
            setLikedTweets(prevTweets => ({
                ...prevTweets,
                [id]: !setLikedTweets[id],
            }));

            axios.post(`/likes/${id}`)
                .then((res) => {
                    console.log(res.data);
                    setLikeCount(likeCount + 1);
                    setLikedState(!likedState);  // <------------- UPDATE LOCAL states + UI
                })
                .catch((error) => {
                    switch (error.response.status) {
                        case 401:
                            setNoAccountDiv(true);
                            break;
                        case 500:
                            setserverError(true);
                        default:
                            console.error(error);
                            break;
                    }
                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
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
                    setLikeCount(likeCount - 1);
                    setLikedState(!likedState); // <------------- UPDATE LOCAL states + UI
                })
                .catch((error) => {
                    switch (error.response.status) {
                        case 401:
                            setNoAccountDiv(true);
                            break;
                        case 500:
                            setserverError(true);
                        default:
                            console.error(error);
                            break;
                    }
                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                });
        }
        // console.log(likedTweets)
    };

    const handleRetweet = (e, id, retweetsByMe) => {
        e.preventDefault();

        if (!retweetsByMe && !retweetTweet[id]) {
            setDisabled(true);
            setRetweetTweet(prevRetweets => ({
                ...prevRetweets,
                [id]: !setRetweetTweet[id],
            }));

            axios.post(`/retweets/${id}`)
                .then((res) => {
                    console.log(res.data);
                    setRetweetCount(retweetCount + 1);
                    setRetweetState(!retweetState);
                })
                .catch((error) => {
                    switch (error.response.status) {
                        case 401:
                            setNoAccountDiv(true);
                            break;
                        case 500:
                            setserverError(true);
                        default:
                            console.error(error);
                            break;
                    }
                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
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
                    setRetweetCount(retweetCount - 1);
                    setRetweetState(!retweetState);
                })
                .catch((error) => {
                    switch (error.response.status) {
                        case 401:
                            setNoAccountDiv(true);
                            break;
                        case 500:
                            setserverError(true);
                        default:
                            console.error(error);
                            break;
                    }
                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                });
        }
    };

    return (


        <div className="interact-row d-flex ">
            {noAccountDiv && <NoAccount currentState={noAccountDiv} />}
            {serverError && <Redirect to="/Error" />}
            <button
                className={comments ? "comment-true col" : "comment col"}
            >
                <FontAwesomeIcon icon={faComment} />
                &nbsp; {comments}

            </button>

            <button
                className={retweetState === true ? "col retweet-true" : "col retweet"}
                onClick={(e) => handleRetweet(e, id, retweetState)}
                disabled={disabled}
            >
                <FontAwesomeIcon icon={faRetweet} />
                &nbsp; {retweetCount}
            </button>

            <button
                className="like col"
                onClick={(e) => handleLike(e, id, likedState)}
                disabled={disabled}
            >
                {likedState === true ?
                    (<FontAwesomeIcon icon={heartSolid} className="text-danger" />)
                    : <FontAwesomeIcon icon={faHeart} />
                }

                &nbsp; {likeCount}
            </button>

            {/* session1 === userPath || */}

            { user.username === username ?
                <button
                    className="col delete"
                    onClick={(e) => handleDelete(e, id)}
                >
                    <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                :
                null
            }
        </div>
    );
}