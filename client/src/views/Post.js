import React, { useState, useEffect, useContext } from 'react';
import '../css/App.css';
import '../css/custom.scss';
import '../css/Sidebar.css';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NoAccount from '../components/NoAccount';
import axios from 'axios';
import Loader from "react-loader-spinner";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile';
import { Link, useHistory, useLocation } from 'react-router-dom';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import ReactTimeAgo from 'react-time-ago/commonjs/ReactTimeAgo';
import { UserContext } from '../Contexts/UserContext';
import OffCanvas from '../components/OffCanvas';

export default function Post() {
    const [user] = useContext(UserContext);

    const [isLiked, setisLiked] = useState(false);
    const [isRetweeted, setisRetweeted] = useState(false)
    const [tweets, setTweets] = useState({ data: [] });            // for displaying tweets and other info
    const [loading, setLoading] = useState(true);      // loading animation
    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [commentDisabled, setCommentDisabled] = useState(true);

    const [comment, setComment] = useState('');

    const [otherComments, setOtherComments] = useState({ data: [] });

    const [count, setCount] = useState(0);

    const [color, setColor] = useState("grey");

    const [tweetErr, setTweetErr] = useState({});

    const [commentReply, setCommentReply] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

    const [noAccountDiv, setNoAccountDiv] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

    const [disableDiv, setDisableDiv] = useState(false);
    const [deleteTweet, setdeleteTweet] = useState({});
    const [likedTweets, setLikedTweets] = useState({});

    const [rows, setRows] = useState(1);

    const [minRows] = useState(1);

    const [maxRows] = useState(8);

    /** 
 * THESE 4 below ARE LOCAL states. (they depend on Props NOT SERVER)
 * They update the UI if Axios returns SUCCESS.
 * SO NO NEED OF FETCHING ALL THE tweets AGAIN from SERVER just for 1 update.
 * 
 * */
    const [commentCount, setCommentCount] = useState(0)
    const [likeCount, setLikeCount] = useState(0); // local
    const [likedState, setLikedState] = useState(0); // local
    const [retweetState, setRetweetState] = useState(0); // local
    const [retweetCount, setRetweetCount] = useState(0)
    //------------------------------------------------------------------------


    let history = useHistory();

    let location = useLocation();
    let path = location.pathname;
    let path1 = path.split(`/post/`);
    let finalPath = path1[1];

    const [error, setError] = useState([]);     //using array, data comes that way
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    const handleLike = (id) => {  //for liking and unliking posts

        setDisabled(true);

        if (!isLiked && likedState === 0) {
            setisLiked(true);

            axios.post(`/likes/${id}`)
                .then((res) => {
                    setDisabled(false);
                    setLikedState(likedState + 1);
                    setLikeCount(likeCount + 1)
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("problem");
                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                });

        } else {
            setisLiked(false);

            axios.delete(`/likes/${id}`)
                .then((res) => {
                    setDisabled(false);
                    setLikedState(likedState - 1);
                    setLikeCount(likeCount - 1)
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("problem");

                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                });
        }
    };
    console.log(retweetState)
    const handleRetweet = (id) => {     // retweeting and unretweeting posts
        setDisabled(true);

        if (!isRetweeted && retweetState === 0) {
            setisRetweeted(true);

            axios.post(`/retweets/${id}`)
                .then((res) => {
                    setDisabled(false);
                    setRetweetState(retweetState + 1);
                    setRetweetCount(retweetCount + 1)
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("problem");
                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                });

        } else {
            setisRetweeted(false);

            axios.delete(`/retweets/${id}`)
                .then((res) => {
                    setDisabled(false);
                    setRetweetState(retweetState - 1);
                    setRetweetCount(retweetCount - 1)
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("problem");

                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                });
        }
    }

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };

    const Error = () => {       //redirect when there is a server error
        return history.push("/NotFound404");
    };

    function getData() {
        axios.get(`/tweets/${finalPath}`)
            .then((res) => {
                setTweets(res);
                setLoading(false);
                setLikeCount(res.data[0].likes);
                setRetweetCount(res.data[0].retweets)
                setCommentCount(res.data[0].comments)

            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) {
                    internalError();
                }
                else if (error.response.status === 404) {
                    Error();
                }
            }).finally(() => {
                setLoading(false);
            });


        axios.get(`/likes/me/${finalPath}`)
            .then((res) => {
                setLikedState(res.data.count);

            })
            .catch((error) => {
                console.error(error);
            });



        axios.get(`retweets/me/${finalPath}`)
            .then((res) => {
                setRetweetState(res.data.count);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function getComments() {
        axios.get(`/comments/tweet/${finalPath}`)
            .then((res) => {
                setOtherComments(res);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    useEffect(() => {   //fetching data for logged in users

        window.scrollTo(0, 0);       //scroll to top of page when it loads

        getData();
        getComments();

    }, [finalPath]); //tweets

    const handleChange = (e) => {
        wordCount(e);

        const textareaLineHeight = 32;

        const previousRows = e.target.rows;
        e.target.rows = minRows;

        const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);

        if (currentRows === previousRows) {
            e.target.rows = currentRows;
        }

        if (currentRows >= maxRows) {
            e.target.rows = maxRows;
            e.target.scrollTop = e.target.scrollHeight;
        }

        setComment(e.target.value);
        setRows(currentRows < maxRows ? currentRows : maxRows);
    };

    const wordCount = (e) => {
        let comment = e.target.value;
        setCount(comment.length);

        let x = comment.trim().replace(/\s/g, '').length;

        if (x === 280) {
            setColor("red");
        } else if (x >= 250) {
            setColor("#FF8000");
        } else if (x >= 200) {
            setColor("#FFB400");
        } else if (x >= 150) {
            setColor("#FFF800");
        } else {
            setColor("grey");
        }

        if (comment.trim().length > 0) {
            setCommentDisabled(false);
        } else {
            setCommentDisabled(true);
        }
    };

    const Loading = () => {        //the loading div
        let x = localStorage.getItem("accent") || 'grey';

        return <div className="d-flex justify-content-center mt-3">
            <Loader type="TailSpin"
                color={x}
                height={50}
                width={50}
            />

        </div>;
    };

    const CommentLoading = () => {
        let x = localStorage.getItem("accent") || 'grey';

        return <div className="d-flex justify-content-center ">
            <Loader type="ThreeDots"
                color={x}
                height={40}
                width={40}
            />

        </div>;
    };

    TimeAgo.addLocale(en);

    let icon = "https://avatars.dicebear.com/api/gridy/" + user.username + ".svg";

    let addEmoji = emoji => {
        setComment(comment + emoji.native);
    };
    const Emoji = () => {
        return <Picker
            onSelect={addEmoji}
            color="#ff6300"
            sheetSize={32}
            emoji='point_up'
            title="Pick your emoji"
            set='twitter'
            style={{ position: 'absolute', marginTop: '20px', right: '20px', zIndex: '1' }}
            theme='auto'
        />;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = commentValidation(comment); /* <-- call the validation fn. */
        if (isValid === true) {
            setCommentLoading(true);
            sendCommentToDb();
        }

        function sendCommentToDb() {
            const tweetObject = {
                content: comment.replace(/\n/g, " ").trim()
            };

            axios.post(`/comments/tweet/${finalPath}`, tweetObject)
                .then((res) => {
                    let tweetDiv = document.getElementById("tweet-modal");
                    tweetDiv.style.display = "none";
                    setComment('');
                    setCount(0);
                    setColor('grey');
                    setShowEmojiPicker(false);
                    setRows(1);
                    getComments();
                    setCommentCount(commentCount + 1)
                })
                .catch((error) => {
                    setError(error.response.data.message);
                    console.error(error);
                })
                .finally(() => {
                    setCommentLoading(false);
                });
        }
    };

    /** Validation check */
    const commentValidation = (twt) => {
        const tweetErr = {};
        let tweetReg = /[<>]+/;
        let isValid = true;

        if (tweetReg.test(twt)) {
            tweetErr.tweetinvalid = "Contains illegal characters";
            isValid = false;
        }
        if (twt.trim().length < 1) {
            tweetErr.tweetinvalid = "Cannot be empty";
            isValid = false;
        }

        setTweetErr(tweetErr);
        return isValid;
    };

    const handleDelete = (e, id) => {
        e.preventDefault();
        setDisableDiv(true);

        if (!deleteTweet[id]) {
            setDisabled(true);
            setDisableDiv(prevDelete => ({
                ...prevDelete,
                [id]: !setDisableDiv[id],
            }));

            axios.delete(`/comments/${id}/tweet/${finalPath}`)
                .then((res) => {
                    getComments();
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("problem");

                }).finally(() => {
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                    // setDisableDiv(false)
                    setDisabled(false);
                });
        }

    };


    return (
        <div className="general" >
            <div className="container App " >
                <div className="row " >

                    {noAccountDiv && <NoAccount currentState={noAccountDiv} />}

                    <Header />

                    <div className="col main-view  phone-home w-100 " >
                        <div className="row profile-header view">

                            <div className="p-2  col row " id="top">
                                <div className="ml-3 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div className="p-1">
                                        <strong>Spicy Take</strong>
                                    </div>
                                </div>
                                <OffCanvas />

                            </div>


                        </div>

                        {loading && <Loading />}
                        {tweets.data.map((item, i) => {
                            let date = new Date(item.dateposted);
                            const options = { dateStyle: "long", timeStyle: "short", hour12: true };
                            let finalDate = new Intl.DateTimeFormat("en-US", options).format(date);

                            document.title = `Post by @${item.User[0].username} - TwitClone`;

                            return <div>
                                <div className="p-2  row" key={i}>
                                    <div className="col-1.5">              {/* <--- user avi */}
                                        <Link
                                            to={`/u/${item.User[0].username}`}
                                        >
                                            <img
                                                src={`https://avatars.dicebear.com/api/gridy/${item.User[0].username}.svg`}
                                                alt="example"
                                                className="user-logo"
                                            />
                                        </Link>

                                    </div>
                                    <div className="col user-name-tweet" >                   {/* <--- user content */}
                                        <div className=" ">
                                            <div>
                                                <Link
                                                    to={`/u/${item.User[0].username}`}
                                                    className="name-link"
                                                >
                                                    <strong>{item.User[0].fullname}</strong>
                                                </Link>
                                            </div>
                                            <span>@{item.User[0].username}</span>
                                        </div>
                                    </div>

                                    <div className="post-data view mr-2">
                                        <div style={{ fontSize: "21px" }} className="mt-2 p-1"  >{item.content}</div>

                                        <div className="view  p-2">
                                            <span>{finalDate}</span>

                                        </div>

                                        {/* showing whether a post has likes, retweets or comments */}
                                        {commentCount === 0 && likeCount === 0 && retweetCount === 0 ? null :
                                            <div className="view mt-1  p-2">
                                                <span className={commentCount === 0 ? "d-none" : "mr-3"}>
                                                    <span
                                                        style={{ fontWeight: 700 }}
                                                        className="text"
                                                    >
                                                        {commentCount}
                                                    </span> {commentCount === 1 ? "Comment" : "Comments "}
                                                </span>

                                                <span className={retweetCount === 0 ? "d-none" : "mr-3"}>
                                                    <span
                                                        style={{ fontWeight: 700 }}
                                                        className="text"
                                                    >
                                                        {retweetCount}
                                                        {/* fix this...to local */}
                                                    </span> {retweetCount === 1 ? "Retweet" : "Retweets"}
                                                </span>

                                                <span className={likeCount === 0 ? "d-none" : null}>
                                                    <span
                                                        style={{ fontWeight: 700 }}
                                                        className="text"
                                                    >
                                                        {likeCount}
                                                        {/* fix this...to local */}
                                                    </span> {likeCount === 1 ? "Like" : "Likes"}
                                                </span>
                                            </div>
                                        }

                                        <div className="interact-row d-flex pt-2 pb-2">
                                            <button className="comment col">
                                                <FontAwesomeIcon icon={faComment} size="lg" />
                                            </button>

                                            <button
                                                className={retweetState === 1 ? "col retweet-true" : "col retweet"}
                                                onClick={() => handleRetweet(item._id)}
                                                disabled={disabled}
                                            >
                                                <FontAwesomeIcon icon={faRetweet} />
                                            </button>

                                            <button
                                                className="like col "
                                                onClick={() => handleLike(item._id)}
                                                disabled={disabled}
                                            >
                                                {likedState === 1 ? (
                                                    <FontAwesomeIcon icon={heartSolid} size="lg" className="text-danger" />
                                                ) : <FontAwesomeIcon icon={faHeart} size="lg" />}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>;
                        })}

                        {user.loggedin &&
                            <div className="p-2 profile-view row mt-3">
                                <div className="col-0.5">              {/* <--- user avi */}
                                    <img src={icon} alt="example" className={commentReply ? "user-logo mt-2" : "user-logo"} />
                                </div>

                                <form className="signup col tweet-form " onSubmit={(e) => handleSubmit(e)}>
                                    {/*  */}
                                    {tweets.data.map((item, i) => (
                                        <div className="" key={i}>

                                            {commentReply &&
                                                <span>Replying to
                                                    <Link to={`/u/${item.User[0].username}`} className="ml-1 accent">
                                                        @{item.User[0].username}
                                                    </Link>
                                                </span>

                                            }

                                            <textarea
                                                id="tweet"
                                                name="tweet"
                                                type="text"
                                                value={comment}
                                                onChange={handleChange}
                                                className=" edit-input post-comment pt-3"
                                                maxLength="280"
                                                rows={rows}
                                                placeholder="What's Your Reply?"
                                                required
                                                onFocus={() => setCommentReply(true)}
                                                style={{ fontSize: '20px', padding: '5px' }}
                                            />
                                            <div style={{ color: "red", fontSize: "20px" }} className="mt-2 error-msg d-flex justify-content-center">{errorDiv}</div>


                                            {Object.keys(tweetErr).map((key) => {
                                                return <div style={{ color: "red" }} className="error-msg"> {tweetErr[key]} </div>;
                                            })}


                                        </div>
                                    ))}


                                    <div className="d-flex flex-row mt-1 justify-content-between">

                                        {commentReply ? //character counter
                                            <div className="d-flex">
                                                <div className="container mt-2">
                                                    <span><span style={{ color }}>{count}</span>/280</span>
                                                </div>

                                                <div className=" ml-4" >
                                                    <FontAwesomeIcon
                                                        size="lg"
                                                        icon={faSmile}
                                                        className="mt-2 icon-active"
                                                        onClick={toggleEmojiPicker}
                                                    />
                                                </div>
                                            </div>
                                            :
                                            null
                                        }

                                        {showEmojiPicker ? <Emoji /> : null}

                                        <button
                                            className="btn login-submit btn-accent-outline rounded-pill "
                                            type="submit"
                                            disabled={commentDisabled}       //button disabler
                                        >
                                            {commentLoading ? <CommentLoading /> : "Tweet"}
                                        </button>
                                    </div>
                                </form>

                            </div>
                        }

                        {otherComments.data.map((item, i) => {
                            let icon = "https://avatars.dicebear.com/api/gridy/" + item.User[0].username + ".svg";

                            return <div className={disableDiv[item._id] ? "p-2 view row main-post-div test name-link modal-enter" : "p-2 view row main-post-div post-link name-link modal-enter"} key={i} >             {/* <--- standard tweet*/}
                                <Link to={`/u/${item.User[0].username}`} className="col-1.5">              {/* <--- user avi */}
                                    <img src={icon} alt="example" className="user-logo" />
                                </Link>

                                <div className="col user-name-tweet post-div">                   {/* <--- user content */}
                                    <div className="user-content">
                                        <Link
                                            to={`/u/${item.User[0].username}`}
                                            className="name-link"
                                        >
                                            <strong>{item.User[0].fullname}</strong> &nbsp;
                                        </Link>

                                        <span>@{item.User[0].username}</span>
                                        &nbsp; <span>·</span> &nbsp;
                                        <span>
                                            <ReactTimeAgo date={item.date} locale="en-US" timeStyle="twitter" />
                                        </span>
                                    </div>
                                    <p className="post-link ">
                                        {item.content}
                                        {/* {item.content.match(/[@]\w+/g) ? " accent" : "post-link "} */}
                                    </p>

                                    <div className="interact-row d-flex ">
                                        <button
                                            className="comment col"
                                            onClick={() => setComment(`@${item.User[0].username} `)}
                                        // style={{ maxWidth: '50%',  }}
                                        >
                                            <FontAwesomeIcon icon={faComment} />
                                        </button>

                                        <button className="col retweet-disabled" disabled>
                                            <FontAwesomeIcon icon={faRetweet} />
                                        </button>

                                        {user.username === item.User[0].username ?
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

                                </div>
                            </div>;
                        })}
                    </div>

                    <Sidebar />

                </div>
            </div>
        </div >

    );
}