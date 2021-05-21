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
// import { Redirect } from 'react-router-dom';
// import Error from '../views/Error';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import ReactTimeAgo from 'react-time-ago/commonjs/ReactTimeAgo';
import { UserContext } from '../Contexts/UserContext';

export default function Post() {
    const [user] = useContext(UserContext);

    const [isLiked, setisLiked] = useState(false);
    const [tweets, setTweets] = useState({ data: [] });            // for displaying tweets and other info
    const [loading, setLoading] = useState(true);      // loading animation
    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [commentDisabled, setCommentDisabled] = useState(true);

    const [isLikedbyMe, setIsLikedbyMe] = useState(0);

    const [isRetweetedbyMe, setisRetweetedbyMe] = useState(0)

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

        if (!isLiked && isLikedbyMe === 0) {
            setisLiked(true);

            axios.post(`/likes/${id}`)
                .then((res) => {
                    // console.log(res.data)
                    setDisabled(false);
                    getData();
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem");
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
                    // console.log(res.data)
                    setDisabled(false);
                    getData();
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem");

                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                });
        }
    };

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
        // return <Redirect to="/Error" />
    };

    const Error = () => {       //redirect when there is a server error
        return history.push("/NotFound404");
        // return <Redirect to={Error} />
    };

    function getData() {
        axios.get(`/tweets/${finalPath}`)
            .then((res) => {
                setTweets(res);
                setLoading(false);
                console.log(res.data)
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
                setIsLikedbyMe(res.data.count);
                // console.log(res.data.count)

            })
            .catch((error) => {
                console.error(error);
            });

        axios.get(`/comments/tweet/${finalPath}`)
            .then((res) => {
                // console.log(res.data)
                setOtherComments(res);
            })
            .catch((err) => {
                console.error(err);
            });

        axios.get(`retweets/me/${finalPath}`)
            .then((res) => {
                // console.log(res.data)
                setisRetweetedbyMe(res.data.count)
            })
            .catch((err) => {
                console.error(err)
            });
    }

    useEffect(() => {   //fetching data for logged in users

        window.scrollTo(0, 0);       //scroll to top of page when it loads

        getData()

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
        // setComment(comment)
        setCount(comment.length);

        // let y = comment.length
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
                height={60}
                width={60}
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

    let icon = "https://avatars.dicebear.com/api/identicon/3.svg";

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

        // const myForm = document.forms.tweetForm; // Or document.forms['tweetForm']
        // const tweet = myForm.elements.tweet.value;

        const isValid = tweetValidation(comment); /* <-- call the validation fn. */
        if (isValid === true) {
            setCommentLoading(true);
            sendToDb();
            // setTweetModal(false);
        }

        function sendToDb() {
            const tweetObject = {
                content: comment.replace(/\n/g, " ").trim()
            };

            axios.post(`/comments/tweet/${finalPath}`, tweetObject)
                .then((res) => {
                    // setTweetLoading(true);
                    let tweetDiv = document.getElementById("tweet-modal");
                    tweetDiv.style.display = "none";
                    setComment('');
                    setCount(0);
                    setColor('grey');
                    setShowEmojiPicker(false);
                    setRows(1);
                    getData();
                    console.log(res.data);
                })
                .catch((error) => {
                    // setTweetLoading(false);
                    setError(error.response.data.message);
                    console.error(error);
                })
                .finally(() => {
                    getData();
                    setCommentLoading(false);
                });
        }
    };

    /** Validation check */
    const tweetValidation = (twt) => {
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
        // return alert(id)
        setDisableDiv(true);

        if (!deleteTweet[id]) {
            setDisabled(true);
            setDisableDiv(prevDelete => ({
                ...prevDelete,
                [id]: !setDisableDiv[id],
            }));

            axios.delete(`/comments/${id}/tweet/${finalPath}`)
                .then((res) => {
                    console.log(res.data);
                    getData();
                })
                .catch((error) => {
                    console.log(id);
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem");

                })
                .finally(() => {
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                    // setDisableDiv(false)
                    setDisabled(false);
                });
        }


    };

    const handleCommentLike = (e, id, likedbyme) => {
        //for liking and unliking posts
        // NOW WORKS 🎉🎉
        //REFER: https://stackoverflow.com/questions/54853444/how-to-show-hide-an-item-of-array-map

        e.preventDefault();
        console.log(likedbyme);

        if (!likedTweets[id] && !likedbyme) {
            setDisabled(true);
            setLikedTweets(prevTweets => ({
                ...prevTweets,
                [id]: !setLikedTweets[id],
            }));

            axios.post(`/likes/${id}`)
                .then((res) => {
                    console.log(res.data);
                    getData();
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem");

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
                    getData();
                })
                .catch((error) => {
                    console.error(error);
                    error.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem");
                }).finally(() => {
                    setDisabled(false);
                    setTimeout(() => {
                        setNoAccountDiv(false);
                    }, 2000);
                });
        }
    };

    return (
        <div className="general" >
            {/* <Navbar /> */}
            <div className="container App " >
                <div className="row " >

                    {noAccountDiv ? <NoAccount currentState={noAccountDiv} /> : null}

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
                            </div>


                        </div>

                        {loading ? <Loading /> : null}
                        {tweets.data.map((item, i) => {
                            let date = new Date(item.dateposted);
                            const options = { dateStyle: 'long', timeStyle: 'short', hour12: true };
                            let finalDate = new Intl.DateTimeFormat("en-US", options).format(date);

                            document.title = `Post by @${item.User[0].username} - TwitClone`;

                            return <div>
                                <div className="p-2  row" key={i}>
                                    <div className="col-1.5">              {/* <--- user avi */}
                                        <Link
                                            to={`/u/${item.User[0].username}`}
                                        >
                                            <img
                                                src={`https://avatars.dicebear.com/api/identicon/${item.User[0].username}.svg`}
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

                                        {item.comments === 0 && item.likes === 0 ? null :
                                            <div className="view mt-1  p-2">
                                                <span className={item.comments === 0 ? "d-none" : "mr-3"}>   {/*show/ hide whether there are comments or not */}
                                                    <span
                                                        style={{ fontWeight: '700' }}
                                                        className="text"
                                                    >
                                                        {item.comments}
                                                    </span> {item.comments === 1 ? "Comment" : "Comments "}
                                                </span>

                                                <span className={item.likes === 0 ? "d-none" : null}>
                                                    <span
                                                        style={{ fontWeight: '700' }}
                                                        className="text"
                                                    >
                                                        {item.likes}
                                                    </span> {item.likes === 1 ? "Like" : "Likes"}      {/*show/ hide the (s) depending on number of likes */}
                                                </span>
                                            </div>
                                        }

                                        <div className="interact-row d-flex pt-2 pb-2">
                                            <button className="comment col">
                                                <FontAwesomeIcon icon={faComment} size="lg" />
                                            </button>

                                            <button className={isRetweetedbyMe === 1 ? "col retweet-true" : "col retweet"}>
                                                <FontAwesomeIcon icon={faRetweet} />

                                            </button>

                                            <button
                                                className="like col "
                                                onClick={() => handleLike(item._id)}
                                                disabled={disabled}
                                            >
                                                {isLiked || isLikedbyMe === 1 ? (
                                                    <FontAwesomeIcon icon={heartSolid} size="lg" className="text-danger" />
                                                ) : <FontAwesomeIcon icon={faHeart} size="lg" />}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                                {/* </div> */}
                            </div>;
                        })}

                        {user ?
                            <div className="p-2 profile-view row mt-3">
                                <div className="col-0.5">              {/* <--- user avi */}
                                    <img src={icon} alt="example" className={commentReply ? "user-logo mt-2" : "user-logo"} />
                                </div>

                                <form className="signup col tweet-form " onSubmit={(e) => handleSubmit(e)}>
                                    {/*  */}
                                    {tweets.data.map((item, i) => (
                                        <div className="" key={i}>

                                            {commentReply ?
                                                <span>Replying to
                                                <Link to={`/u/${item.User[0].username}`} className="ml-1 accent">
                                                        @{item.User[0].username}
                                                    </Link>
                                                </span>
                                                :
                                                null
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

                                    {/* {loading ? <Loading /> : null} */}

                                    <div className="d-flex flex-row mt-1 justify-content-between">

                                        {commentReply ? //character counter
                                            <div className="d-flex">
                                                <div className="container mt-2">
                                                    <span><span style={{ color }}>{count}</span>/280</span>
                                                    {/* <span id="show">0</span><span>/280</span> */}
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

                                        {/* <Picker
                                        set='twitter'
                                        onSelect={addEmoji}
                                        title='Pick your emoji…'
                                        emoji='point_up'
                                        style={{ position: 'absolute', marginTop: '20px', right: '20px', zIndex: '2' }}
                                        theme='auto'
                                    /> */}

                                        <button
                                            // id="submit-btn"
                                            className="btn login-submit btn-accent-outline rounded-pill "
                                            type="submit"
                                            // onClick={handleSubmit}
                                            disabled={commentDisabled}       //button disabler
                                        >
                                            {commentLoading ? <CommentLoading /> : "Tweet"}
                                        </button>
                                    </div>
                                </form>

                            </div>
                            : null}

                        {otherComments.data.map((item, i) => {
                            let icon = "https://avatars.dicebear.com/api/identicon/" + item.User[0].username + ".svg";

                            return <Link to={`/post/${item._id}`} className={disableDiv[item._id] ? "p-2 view row main-post-div test name-link" : "p-2 view row main-post-div post-link name-link"} key={i} >             {/* <--- standard tweet*/}
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
                                    <p className="post-link ">{item.content}</p>

                                    <div className="interact-row d-flex ">
                                        <button
                                            className="comment col"
                                        // onClick={() => setCommentModal(true)}
                                        >
                                            <FontAwesomeIcon icon={faComment} />
                                            {/* &nbsp; {item.comments} */}
                                        </button>

                                        <button className="col retweet">
                                            <FontAwesomeIcon icon={faRetweet} />
                                        </button>

                                        <button
                                            className="like col"
                                            onClick={(e) => handleCommentLike(e, item._id, item.isLikedbyme)}
                                            disabled={disabled}

                                        >
                                            {likedTweets[item._id] || item.isLikedbyme ?
                                                (<FontAwesomeIcon icon={heartSolid} className="text-danger" />)
                                                : <FontAwesomeIcon icon={faHeart} />
                                            }

                                            {/* &nbsp; {item.likes} */}
                                        </button>

                                        {user === item.User[0].username ?
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
                            </Link>;
                        })}
                    </div>

                    <Sidebar />

                </div>
            </div>
        </div >

    );
}