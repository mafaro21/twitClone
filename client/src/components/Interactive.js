import React, { useState, useContext } from 'react'
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
// import { useLocation } from 'react-router-dom';
import axios from 'axios';
import NoAccount from '../components/NoAccount';
import { UserContext } from '../Contexts/UserContext';


export default function Interactive({ id, comments, retweets, likes, likesByMe, passChildData, retweetsByMe, username }) {
    //most props are from profile.js

    const [user] = useContext(UserContext);
    const [likedTweets, setLikedTweets] = useState({}); // FOR HANDLING LIKES state

    const [deleteTweet, setdeleteTweet] = useState({})
    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [retweetTweet, setRetweetTweet] = useState({})
    const [noAccountDiv, setNoAccountDiv] = useState(false) //shows modal that tells user they need to sign/log in



    // let location = useLocation()
    // let path = location.pathname
    // let path1 = path.split('/u/')
    // let userPath = path1[1]


    const handleDelete = (e, id) => {
        e.preventDefault()

        if (!deleteTweet[id]) {
            setDisabled(true);
            setdeleteTweet(prevDelete => ({
                ...prevDelete,
                [id]: !setdeleteTweet[id],
            }));

            axios.delete(`/tweets/${id}`)
                .then((res) => {
                    console.log(res.data);
                    passChildData(true)
                    // getData()
                })
                .catch((error) => {
                    // console.log(id)
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem")

                })
                .finally(() => {
                    setTimeout(() => {
                        setNoAccountDiv(false)
                    }, 2000);
                    setdeleteTweet(false)
                    setDisabled(false);
                })
        }
    }

    const handleLike = (e, id, likesByMe) => {
        //for liking and unliking posts
        // NOW WORKS 🎉🎉
        //REFER: https://stackoverflow.com/questions/54853444/how-to-show-hide-an-item-of-array-map

        e.preventDefault()
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
                    passChildData(true)
                    // getData()
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("something went wrong")

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
                    // getData()
                    passChildData(true)
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
        // console.log(likedTweets)
    };

    const handleRetweet = (e, id, retweetsByMe) => {
        e.preventDefault()

        if (!retweetsByMe && !retweetTweet[id]) {
            setDisabled(true);
            setRetweetTweet(prevRetweets => ({
                ...prevRetweets,
                [id]: !setRetweetTweet[id],
            }));

            axios.post(`/retweets/${id}`)
                .then((res) => {
                    console.log(res.data);
                    passChildData(true)
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
                    passChildData(true)
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
        console.log(retweetTweet)
    }

    return (


        <div className="interact-row d-flex ">
            {noAccountDiv ? <NoAccount currentState={noAccountDiv} /> : null}

            <button
                className={comments ? "comment-true col" : "comment col"}
            >
                <FontAwesomeIcon icon={faComment} />
                &nbsp; {comments}

            </button>

            <button
                className={retweetsByMe ? "col retweet-true" : "col retweet"}
                onClick={(e) => handleRetweet(e, id, retweetsByMe)}
                disabled={disabled}
            >
                <FontAwesomeIcon icon={faRetweet} />
                &nbsp; {retweets} {retweetsByMe}
            </button>

            <button
                className="like col"
                onClick={(e) => handleLike(e, id, likesByMe)}
                disabled={disabled}
            >
                {likesByMe ?
                    (<FontAwesomeIcon icon={heartSolid} className="text-danger" />)
                    : <FontAwesomeIcon icon={faHeart} />
                }

                &nbsp; {likes}
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