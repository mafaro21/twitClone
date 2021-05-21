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
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import Loader from "react-loader-spinner";
import { UserContext } from '../Contexts/UserContext';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import { Link, useLocation } from 'react-router-dom';

function Home() {
    const [user] = useContext(UserContext);
    let location = useLocation();

    const [disabled, setDisabled] = useState(true);
    const [count, setCount] = useState(0);

    const [color, setColor] = useState("grey");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);
    const [rows, setRows] = useState(1);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [sessionName, setSessionName] = useState('');
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
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    let icon = `https://avatars.dicebear.com/api/identicon/${user.username}.svg`;

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
                height={60}
                width={60}
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
            // setTweetModal(false);

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

                })
                .catch((error) => {
                    setTweetLoading(false);
                    // setTweetModal(true);
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

    /** ⚠⛔🚫 NEEDS REPLACING with BUTTON 🔽 => INFINITE LOOP FETCHING! */
     window.onscroll = function () {
    //    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
    //         // window.alert(`the last id is ${lastID}`)
    //          window.scroll(0,0)
    //         GetNewTweets(lastID);
    //     } 
     }

    function GetNewTweets(lastTweetID) {
        if (location.pathname === '/home') {
            setNewTweetsLoader(true);

            axios.get(`/tweets/?lt=${lastTweetID}`)
                .then((res) => {
                    // console.log(res.data);
                    setNewTweets(res);
                })
                .catch((err) => {
                   window.alert(err.response.data);
                })
                .finally(() => {
                    setNewTweetsLoader(false);
                });

        }
    }


    if (childData) {
        setchildData(false);
      //  UpdateData();
    }


    return (
        <div className="App general ">
            {/* <Navbar /> */}
            <div className="container ">


                <div className="row ">

                    <Header />

                    <div className="col main-view phone-home ">
                        <div className="row profile-header view p-3">

                            <div >
                                <strong className="text" style={{ fontSize: '20px' }}>Home </strong>
                            </div>
                        </div>

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
                                    {/*  */}

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




                                    {/* {loading ? <Loading /> : null} */}

                                    <div className="d-flex flex-row mt-1 justify-content-between">

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

                                        {showEmojiPicker ? <Emoji /> : null}

                                        <button
                                            // id="submit-btn"
                                            className="btn login-submit btn-accent-outline rounded-pill "
                                            type="submit"
                                            // onClick={handleSubmit}
                                            disabled={disabled}       //button disabler
                                        >
                                            {tweetLoading ? <TweetLoading /> : "Tweet"}
                                        </button>
                                    </div>
                                </form>

                            </div>
                            : null}

                        <div className="row profile-header view p-3">

                            <div >
                                <strong className="text" style={{ fontSize: '20px' }}>Your Feed </strong>
                            </div>
                        </div>
                        {loading ? <Loading /> : null}
                        {allTweets.data.map((item) => {
                            let icon = `https://avatars.dicebear.com/api/identicon/${item.User[0].username}.svg`;
                            // console.log(item.User[0].username)

                            return <div className="p-2 view row" key={item._id}>             {/* <--- standard tweet*/}
                                <div className="col-1.5">              {/* <--- user avi */}
                                    <img src={icon} alt="example" className="user-logo" />
                                </div>
                                <div className="col user-name-tweet">                   {/* <--- user content */}
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

                                    <p>{item.content}</p>

                                    <Interactive
                                        id={item._id}
                                        comments={item.comments}
                                        retweets={item.retweets}
                                        likes={item.likes}
                                        likesByMe={item.isLikedbyme}
                                        retweetsByMe={item.isRetweetbyme}
                                        passChildData={setchildData}
                                        username={item.User[0].username} // this is a test
                                    />

                                </div>
                            </div>;
                        })}

                        {/* <--- standard tweet*/}
                        {newTweetsLoader ? <Loading /> : null}
                        {newTweets.data.map((item) => {
                            let icon = `https://avatars.dicebear.com/api/identicon/${item.User[0].username}.svg`;
                            console.log(item.User[0].username);
                            console.log('wtf');

                            return <div className="p-2 view row" key={item._id}>             {/* <--- standard tweet*/}
                                <div className="col-1.5">              {/* <--- user avi */}
                                    <img src={icon} alt="example" className="user-logo" />
                                </div>
                                <div className="col user-name-tweet">                   {/* <--- user content */}
                                    <div >
                                        <Link
                                            to={`/u/${item.User[0].username}`}
                                            className="name-link"
                                        >
                                            <span style={{ fontWeight: 700 }} >{item.User[0].fullname}</span>&nbsp;
                                        </Link>
                                        <span>@{item.User[0].username}</span>

                                            &nbsp; <span>·</span> &nbsp;
                                            <span>
                                            <ReactTimeAgo date={item.dateposted} locale="en-US" timeStyle="twitter" />
                                        </span>
                                    </div>

                                    <p>{item.content}</p>

                                    <Interactive
                                        id={item._id}
                                        comments={item.comments}
                                        retweets={item.retweets}
                                        likes={item.likes}
                                        likesByMe={item.isLikedbyme}
                                        retweetsByMe={item.isRetweetbyme}
                                        passChildData={setchildData}
                                    />

                                </div>
                            </div>;
                        })}
                    </div>

                    <Sidebar />
                </div>
            </div>
        </div>
    );
}

export default Home;

//<h1>Welcome</h1>
