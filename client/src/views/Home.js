import React, { useEffect, useState } from 'react'
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import Interactive from '../components/Interactive';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import tobias from '../images/polina-kuzovkova.jpg';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Loader from "react-loader-spinner";
import TweetLoading from '../components/Header'

function Home() {
    const [disabled, setDisabled] = useState(true);
    const [count, setCount] = useState(0)

    const [color, setColor] = useState("grey")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker)
    const [rows, setRows] = useState(1)

    const [comment, setComment] = useState('')
    const [sessionName, setSessionName] = useState('')
    const [tweetLoading, setTweetLoading] = useState(true)


    const [minRows] = useState(1)

    const [maxRows] = useState(8)
    const [tweetErr, setTweetErr] = useState({})
    const [error, setError] = useState([]);     //using array, data comes that way
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    let icon = `https://avatars.dicebear.com/api/identicon/${sessionName}.svg`

    useEffect(() => {

        (() => {
            axios.get("/statuslogin")
                .then((res) => {
                    setSessionName(res.data.user)
                    // let x = res.data.user
                    // getProfile(x)
                });
        })();

        document.title = "TwitClone - Home"

    }, [])

    const handleChange = (e) => {
        wordCount(e)

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

        setComment(e.target.value)
        setRows(currentRows < maxRows ? currentRows : maxRows)
    }

    const wordCount = (e) => {
        let comment = e.target.value
        // setComment(comment)
        setCount(comment.length)

        // let y = comment.length
        let x = comment.trim().replace(/\s/g, '').length;

        if (x === 280) {
            setColor("red")
        } else if (x >= 250) {
            setColor("#FF8000")
        } else if (x >= 200) {
            setColor("#FFB400")
        } else if (x >= 150) {
            setColor("#FFF800")
        } else {
            setColor("grey")
        }

        if (comment.length > 0) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }

    let addEmoji = emoji => {
        setComment(comment + emoji.native)
    }
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
        />
    }

    const TweetLoading = () => {    //loader after tweet has been sent
        let x = localStorage.getItem("accent") || 'grey'

        return <div className="d-flex justify-content-center">
            <div className="modal-wrapper" >
                <div className=" d-flex tweet-loader" >
                    <Loader type="TailSpin"
                        color={x}
                        height={40}
                        width={40}
                        className="d-flex "
                    />
                    <div className="mt-2 ml-3" style={{ color: 'orange' }}>Sending Spicy Tweet...</div>
                </div>
            </div>
        </div>
    }

    // let percent = 60;

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisabled(true)
        setTweetLoading(true)

        const isValid = tweetValidation(comment); /* <-- call the validation fn. */
        if (isValid === true) {
            sendToDb();
            // setTweetModal(false);

        }

        function sendToDb() {
            const tweetObject = {
                content: comment.replace(/\n/g, " ").trim()
            }

            axios.post("/tweets", tweetObject)
                .then(() => {
                    setTweetLoading(true);
                    let tweetDiv = document.getElementById("tweet-modal")
                    tweetDiv.style.display = "none"
                    setComment('')
                    setCount(0)
                    setColor('grey')
                    setShowEmojiPicker(false)
                    setRows(3)

                })
                .catch((error) => {
                    setTweetLoading(false);
                    // setTweetModal(true);
                    setError(error.response.data.message);
                })
                .finally(() => {
                    setTweetLoading(false);
                    setDisabled(false)
                });
        }
    }

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
    }


    const LineLoader = () => {
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
                                <strong className="text" style={{ fontSize: '20px' }}>Home</strong>
                            </div>
                        </div>

                        <div style={{ color: "red", fontSize: "20px" }} className="mt-2 error-msg d-flex justify-content-center">{errorDiv}</div>
                        {Object.keys(tweetErr).map((key) => {
                            return <div style={{ color: "red" }} className="error-msg"> {tweetErr[key]} </div>
                        })}



                        {sessionName ?
                            <div className="p-2 profile-view row mt-3">
                                {tweetLoading ? <linearProgress /> : null}
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
                                            Tweet
                                    </button>
                                    </div>
                                </form>

                            </div>
                            : null}

                        <div className="p-2 view row">             {/* <--- standard tweet*/}
                            <div className="col-1.5">              {/* <--- user avi */}
                                <img src={icon} alt="example" className="user-logo" />
                            </div>
                            <div className="col user-name-tweet">                   {/* <--- user content */}
                                <div className="user-content">
                                    first user &nbsp; <span>@firstuser69</span>
                                </div>
                                <p>this is my first tweet</p>
                                <Interactive />

                            </div>
                        </div>                                     {/* <--- standard tweet*/}

                        <div className="p-2 view row">
                            <div className="col-1.5 ">
                                <img src={icon} alt="example" className="user-logo" />
                            </div>
                            <div className="col user-name-tweet">
                                <div className="user-content">
                                    first user  &nbsp; <span> @firstuser69</span>
                                </div>
                                <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                    It has survived not only five centuries,
                                    but also the leap into electronic typesetting,
                                    remaining essentially unchanged.
                                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                                    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </p>
                                <Interactive />
                            </div>
                        </div>

                        <div className="p-2 view row">
                            <div className="col-1.5 ">
                                <img src={icon} alt="example" className="user-logo" />
                            </div>
                            <div className="col user-name-tweet">
                                <div className="user-content">
                                    first user &nbsp; <span> @firstuser69</span>
                                </div>
                                <p>travelling......</p>
                                <p>
                                    <img src={tobias} alt="test" className="tweet-img" />
                                </p>
                                <Interactive />
                            </div>
                        </div>
                    </div>

                    <Sidebar />
                </div>
            </div>
        </div>
    );
}

export default Home;

//<h1>Welcome</h1>
