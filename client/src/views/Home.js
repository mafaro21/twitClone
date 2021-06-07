import React, { useEffect, useState, useContext } from 'react';
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import Interactive from '../components/Interactive';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile';
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons/faArrowCircleDown';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import Loader from "react-loader-spinner";
import { UserContext } from '../Contexts/UserContext';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import { Link, useLocation } from 'react-router-dom';
import NoAccount from '../components/NoAccount';
import OffCanvas from '../components/OffCanvas';


function Home() {
    const [user] = useContext(UserContext);
    let location = useLocation();

    const [disabled, setDisabled] = useState(true);
    const [count, setCount] = useState(0);
    const [deleteId, setDeleteId] = useState(0)

    const [color, setColor] = useState("grey");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);
    const [rows, setRows] = useState(1);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [endOfTweets, setEndOfTweets] = useState(false)   //showing the bottom div when the last tweets have been fetched
    const [tweetLoading, setTweetLoading] = useState(false);
    const [allTweets, setAllTweets] = useState({ data: [] });
    const [newTweets, setNewTweets] = useState({ data: [] });
    const [childData, setchildData] = useState(false);   //boolean from interactve.js on whether to refresh data
    const [lastID, setLastID] = useState('');  //the last id in the .map
    const [minRows] = useState(1);
    const [newTweetsLoader, setNewTweetsLoader] = useState(false);
    const [maxRows] = useState(8);
    const [tweetErr, setTweetErr] = useState({});
    const [error, setError] = useState([]);     //using array, data comes that way
    const [noAccountDiv, setNoAccountDiv] = useState(false); //shows modal that tells user they need to sign/log in



    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    let icon = `https://avatars.dicebear.com/api/gridy/${user.username}.svg`;

    function getData() {
        setLoading(true);
        axios.get(`/tweets/`)
            .then((res) => {
                setAllTweets(res)
                let x = res.data.length - 1;     // to fetch the last id inside the .map
                setLastID((res.data[x]._id));
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        window.scroll(0, 0);

        document.title = "TwitClone - Home";
        getData();
    }, []);

    function UpdateData() {
        axios.get(`/tweets/`)
            .then((res) => {
                setAllTweets(res);
                let x = res.data.length - 1;     // to fetch the last id inside the .map
                setLastID((res.data[x]._id));
            })
            .catch((err) => {
                console.error(err);
            });
    }

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
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };

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

    const TweetLoading = () => {    //loader after tweet has been sent
        let x = localStorage.getItem("accent") || 'grey';

        return <div className="d-flex justify-content-center ">
            <Loader type="ThreeDots"
                color={x}
                height={40}
                width={40}
            />

        </div>;
    };

    const Loading = () => {

        let x = localStorage.getItem("accent") || 'grey';

        return <div className="accent d-flex justify-content-center mt-2">
            <Loader type="TailSpin"
                color={x}
                height={50}
                width={50}
            />

        </div>;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisabled(true);


        const isValid = tweetValidation(comment); /* <-- call the validation fn. */
        if (isValid === true) {
            setTweetLoading(true);
            sendToDb();

        }

        function sendToDb() {
            const tweetObject = {
                content: comment.replace(/\n/g, " ").trim()
            };

            axios.post("/tweets", tweetObject)
                .then(() => {
                    setTweetLoading(true);
                    let tweetDiv = document.getElementById("tweet-modal");
                    tweetDiv.style.display = "none";
                    setComment('');
                    setCount(0);
                    setColor('grey');
                    setShowEmojiPicker(false);
                    setRows(3);
                    UpdateData()
                })
                .catch((error) => {
                    setTweetLoading(false);
                    setError(error.response.data.message);
                })
                .finally(() => {
                    setTweetLoading(false);
                    setDisabled(false);
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

    TimeAgo.addLocale(en);   //for the time ago

    function GetNewTweets(lastTweetID) {
        if (location.pathname === '/home') {
            setNewTweetsLoader(true);

            axios.get(`/tweets/?lt=${lastTweetID}`)
                .then((res) => {
                    setNewTweets(res);
                    let x = res.data.length - 1;     // to fetch the last id inside the .map
                    setLastID((res.data[x]._id));
                })
                .catch((err) => {
                    setEndOfTweets(true)
                })
                .finally(() => {
                    setNewTweetsLoader(false);
                });

        }
    }

    const EndOfTweets = () => {
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>~~You have reached the end~~</span>

        </div>;
    };

    if (childData) {
        setchildData(false);
        UpdateData();
    }





    return (
        <div className="App general ">
            <div className="container ">


                <div className="row ">

                    <Header />
                    {noAccountDiv && <NoAccount currentState={noAccountDiv} />}

                    <div className="col main-view phone-home ">
                        {user.loggedin ?
                            <div className="row profile-header view p-3">

                                <strong className="text col mt-2" style={{ fontSize: '20px' }}>Home </strong>
                                <OffCanvas />
                                {/* user icon for phone view */}
                            </div>
                            : null}

                        <div style={{ color: "red", fontSize: "20px" }} className="mt-2 error-msg d-flex justify-content-center">{errorDiv}</div>
                        {Object.keys(tweetErr).map((key) => {
                            return <div style={{ color: "red" }} className="error-msg"> {tweetErr[key]} </div>;
                        })}


                        {user.loggedin === true ?
                            <div className="p-2 profile-view row mt-3">

                                <div className="col-0.5">              {/* <--- user avi */}
                                    <img src={icon} alt="example" className="user-logo" />
                                </div>



                                <form className="signup col tweet-form " onSubmit={(e) => handleSubmit(e)}>

                                    <textarea
                                        id="tweet"
                                        name="tweet"
                                        type="text"
                                        value={comment}
                                        onChange={handleChange}
                                        className=" edit-input post-comment pt-3"
                                        maxLength="280"
                                        rows={rows}
                                        placeholder="What's happening?"
                                        required
                                        style={{ fontSize: '20px', padding: '5px' }}
                                    />

                                    <div className="d-flex flex-row mt-1 justify-content-between">

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

                                        {showEmojiPicker ? <Emoji /> : null}

                                        <button
                                            className="btn login-submit btn-accent-outline rounded-pill "
                                            type="submit"
                                            disabled={disabled}       //button disabler
                                        >
                                            {tweetLoading ? <TweetLoading /> : "Tweet"}
                                        </button>
                                    </div>
                                </form>

                            </div>
                            : null}

                        <div className="row  view p-3">

                            <strong className="text col" style={{ fontSize: '20px' }}>Your Feed </strong>
                            {user.loggedin ? null : <OffCanvas />}
                        </div>
                        {loading ? <Loading /> : null}
                        {allTweets.data.map((item) => {
                            let icon = `https://avatars.dicebear.com/api/gridy/${item.User[0].username}.svg`;

                            return <div className={item._id === deleteId ? "p-2 view row main-post-div delete-div" : "p-2 view row main-post-div modal-enter"} key={item._id}>             {/* <--- standard tweet*/}
                                <div className="col-1.5">              {/* <--- user avi */}
                                    <img src={icon} alt="example" className="user-logo" />
                                </div>
                                <Link to={`/post/${item._id}`} className="col user-name-tweet post-div">                   {/* <--- user content */}
                                    <div >
                                        <Link
                                            to={`/u/${item.User[0].username}`}
                                            className="name-link"
                                        >
                                            <strong >{item.User[0].fullname}</strong>&nbsp;
                                        </Link>
                                        <span>@{item.User[0].username}</span>

                                            &nbsp; <span>·</span> &nbsp;
                                            <span>
                                            <ReactTimeAgo date={item.dateposted} locale="en-US" timeStyle="twitter" />
                                        </span>
                                    </div>

                                    <p className="post-link">{item.content}</p>

                                    <Interactive
                                        id={item._id}
                                        comments={item.comments}
                                        retweets={item.retweets}
                                        likes={item.likes}
                                        likesByMe={item.isLikedbyme}
                                        retweetsByMe={item.isRetweetbyme}
                                        passChildData={setchildData}
                                        username={item.User[0].username} // this is a test
                                        deleteID={setDeleteId}
                                        logInFirst={setNoAccountDiv}

                                    />

                                </Link>
                            </div>;
                        })}


                        {newTweets.data.map((item) => {
                            let icon = `https://avatars.dicebear.com/api/gridy/${item.User[0].username}.svg`;

                            return <div className="p-2 view row main-post-div modal-enter" key={item._id}>             {/* <--- standard tweet*/}
                                <div className="col-1.5">              {/* <--- user avi */}
                                    <img src={icon} alt="example" className="user-logo" />
                                </div>
                                <Link to={`/post/${item._id}`} className="col user-name-tweet post-div">                   {/* <--- user content */}
                                    <div >
                                        <Link
                                            to={`/u/${item.User[0].username}`}
                                            className="name-link"
                                        >
                                            <strong >{item.User[0].fullname}</strong>&nbsp;
                                        </Link>
                                        <span>@{item.User[0].username}</span>

                                            &nbsp; <span>·</span> &nbsp;
                                            <span>
                                            <ReactTimeAgo date={item.dateposted} locale="en-US" timeStyle="twitter" />
                                        </span>
                                    </div>

                                    <p className="post-link">{item.content}</p>


                                    <Interactive
                                        id={item._id}
                                        comments={item.comments}
                                        retweets={item.retweets}
                                        likes={item.likes}
                                        likesByMe={item.isLikedbyme}
                                        retweetsByMe={item.isRetweetbyme}
                                        username={item.User[0].username} // this is a test
                                        passChildData={setchildData}
                                        logInFirst={setNoAccountDiv}
                                    />

                                </Link>
                            </div>;
                        })}

                        {newTweetsLoader ? <Loading /> : null}


                        {loading ? null :
                            <div className="main-post-div p-2 row d-flex justify-content-center" onClick={() => GetNewTweets(lastID)}>

                                {endOfTweets ?
                                    <EndOfTweets />
                                    :
                                    <FontAwesomeIcon icon={faChevronDown} size="2x" style={{ opacity: '0.5' }} className="accent" />
                                }
                            </div>
                        }
                    </div>

                    <Sidebar />
                </div>
            </div>
        </div>
    );
}

export default Home;

//<h1>Welcome</h1>
