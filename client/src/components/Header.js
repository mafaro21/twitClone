import React, { useState, useEffect, useRef, useContext } from 'react';
import '../css/Sidebar.css';
import '../css/custom.scss';
import OutsideClick from './OutsideClick'
import ThemeToggle from './ThemeToggle'
// import Compose from '../views/Compose';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Loader from "react-loader-spinner";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons/faFeatherAlt'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { UserContext } from '../Contexts/UserContext';

export default function Header() {
    const [user, setUser] = useContext(UserContext)
    // const [username, setUsername] = useContext(UserContext)

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");

    const [userModal, setUserModal] = useState(false);
    const userToggle = () => setUserModal(!userModal);

    const [moreModal, setMoreModal] = useState(false);
    const moreToggle = () => setMoreModal(!moreModal);

    const [tweetModal, setTweetModal] = useState(false);//tweet modal
    const tweetToggle = () => setTweetModal(!tweetModal);

    const [tweetLoading, setTweetLoading] = useState(false)

    const [tweetErr, setTweetErr] = useState({})

    const [tweetContent, setTweetContent] = useState('')

    const [count, setCount] = useState(0)

    const [color, setColor] = useState("grey")

    const [disabled, setDisabled] = useState(true);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker)

    const [rows, setRows] = useState(2)

    const [minRows] = useState(3)

    const [maxRows] = useState(10)

    // const [addEmoji, setAddEmoji] = useState('')

    let history = useHistory()
    
    let tweetRef = useRef(); // this is to prevent the modal from refreshing when a user types something

    const [error, setError] = useState([]);     //using array, data comes that way
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    let icon = "https://avatars.dicebear.com/api/identicon/" + username + ".svg";

    useEffect(() => {
    
        (()=> {
            axios.get("/statuslogin")
                .then(res => {
                    setUser(res.data.loggedin)
                    setFullname(res.data.fullname);
                    setUsername(res.data.user);
// console.log(res.data)
                });
        })();       

    }, []);

    
    const UserModal = () => {
        return <div className="user-modal modal-enter mr-1 ">
            <button
                className="text p-2 user-modal-btn rounded"
                type="submit"
                onClick={Logout}
            >
                Log out @{username}
            </button>
        </div >
    }

    const MoreModal = () => {
        return <div className="user-modal modal-enter more-modal mr-1">
            <button
                className="text p-2 user-modal-btn "
                type="submit"      
            >
                Change Theme                
            </button>


        </div >
    }

    /** Logout function */
    const Logout = () => {  
        axios.get("/logout")
            .then((res) => {
                history.push("/");
            });
    }

    /** Live word-counter */
    const wordCount = () => {   
        document.getElementById("tweet").addEventListener('input', function () {
            var text = this.value,
                count = text.trim().replace(/\s/g, '').length;

            
            if (count === 280) {
                document.getElementById('show').style.color = "red"
            } else if (count >= 250) {
                document.getElementById('show').style.color = "#FF8000"
            } else if (count >= 200) {
                document.getElementById('show').style.color = "#FFB400"
            } else if (count >= 150) {
                document.getElementById('show').style.color = "#FFF800"
            } else {
                document.getElementById('show').style.color = "grey"
            }

            if (count > 0) {        // used to disable button if textarea is empty
                document.getElementById("submit-btn").disabled = false;
            } else {
                document.getElementById("submit-btn").disabled = true;
            }

            document.getElementById('show').textContent = count;
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const myForm = document.forms.tweetForm; // Or document.forms['tweetForm']
        const tweet = myForm.elements.tweet.value;

        const isValid = tweetValidation(tweet); /* <-- call the validation fn. */
        if (isValid === true) {
            setTweetLoading(true);
            sendToDb();
                  
        }

        function sendToDb() {
            const tweetObject = {
                content: tweet.replace(/\n/g, " ").trim()
            }

            axios.post("/tweets", tweetObject)
                .then(() => {
                    
                    let tweetDiv = document.getElementById("tweet-modal")
                    tweetDiv.style.display = "none"
                    setTweetContent('')
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


    // OutsideClick(tweetRef, () => {
    //     setMoreModal(false)

    // });

    const TweetLoading = () => {    //loader after tweet has been sent
        let x = localStorage.getItem("accent") || 'grey'
        
        return <div className="d-flex justify-content-center ">
            <Loader type="ThreeDots"
                color={x}
                height={40}
                width={40}
            />

        </div>
    }

    const TweetModal = () => {
        return <div id="tweet-modal">
            <div className="modal-wrapper" >
                <div className="tweettest  modal-enter" >
                    <div className="">
                        <div className="modal-view">
                            <div className="modal-header">
                                <button className="" onClick={tweetToggle}>
                                    <svg viewBox="0 0 24 24" className="back-button ">
                                        <g>
                                            <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z">
                                            </path>
                                        </g>
                                    </svg>
                                </button>
                            </div>

                            <div style={{ color: "red", fontSize: "20px" }} className="mt-2 error-msg d-flex justify-content-center">{errorDiv}</div>


                            <div className="modal-body row ">
                                <div className="col-1">
                                    <img src={icon} alt="example" className="user-tweet-img" />
                                </div>

                                <form id="tweetForm1" className="signup col tweet-form" onSubmit={(e) => handleSubmit(e)} >

                                    <div className="view">
                                        <textarea

                                            id="tweet"
                                            name="tweet"
                                            type="text"
                                            // value={addEmoji}

                                            onChange={wordCount}
                                            className=" edit-input "
                                            maxLength="280"
                                            rows="5"
                                            placeholder="Any Hot Takes?"
                                            required
                                        />

                                        
                                        {Object.keys(tweetErr).map((key) => {
                                            return <div style={{ color: "red" }} className="error-msg"> {tweetErr[key]} </div>
                                        })}
                                    </div>

                                    <div className="d-flex flex-row mt-1">
                                        <div className="container ">
                                            {/* {count}/280 */}
                                            <span id="show">0</span><span>/280</span>
                                        </div>

                                        {/* <Picker
                                            set='twitter'
                                            // onSelect={addEmoji}
                                            title='Pick your emoji…'
                                            emoji='point_up'
                                            style={{ position: 'absolute', marginTop: '20px', right: '20px' }}
                                            theme='auto'
                                        /> */}

                                        <button
                                            id="submit-btn"
                                            className="btn login-submit btn-accent-outline rounded-pill   "
                                            type="submit"
                                        // onClick={handleSubmit}
                                        // disabled={disabled}       //button disabler
                                        >
                                            Tweet
                                    </button>
                                    </div>
                                        
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    };
 
    let location = useLocation()    //for current location
    let path = location.pathname

    const ref = useRef();   //clicking outside closes modal

    OutsideClick(ref, () => {
        setUserModal(false)

    });

    const toggleTest = () => {
        let tweetDiv = document.getElementById("tweet-modal")
        let button = document.getElementById("tweet-button")
        let buttonClose = document.getElementById("tweet-close")

        button.addEventListener("click", () => {

            showDiv = !showDiv
            if (showDiv === true) {
                tweetDiv.style.display = "block"
            } else {
                tweetDiv.style.display = "none"
            }
  
        })

        buttonClose.addEventListener("click", () => {

            
            if (1 != 3) {
                tweetDiv.style.display = "none"
                setTweetContent('')
                setCount(0)
                setColor('grey')
                setRows(3)
                setShowEmojiPicker(false)
                setTweetErr('')
            }
        })

        let showDiv = false

    }
    
    const handleChange = (e) => {
        setTweetContent(e.target.value)
        wordCountReact(e)

        const textareaLineHeight = 40;

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

        // setComment(e.target.value)
        setRows(currentRows < maxRows ? currentRows : maxRows)
    }

    const wordCountReact = (e) => {
        let tweetContent = e.target.value
        // setComment(comment)
        setCount(tweetContent.length)

        // let y = comment.length
        let x = tweetContent.trim().replace(/\s/g, '').length;

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

        if (tweetContent.length !== 0) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }
    
    let addEmoji = emoji => {
        setTweetContent(tweetContent + emoji.native)
    }
    const Emoji = () => {
        return <Picker
            onSelect={addEmoji}
            color="#ff6300"
            sheetSize={32}
            emoji='point_up'
            title="Pick your emoji"
            set='twitter'
            style={{ position: 'absolute', marginTop: '20px', right: '20px' }}
            theme='auto'
        />
    }
    

    return (
        <header className=" header pt-3" >
            {tweetModal ? <TweetModal /> : null}
            <div id="tweet-modal">
                <div className="modal-wrapper" >
                    <div className="tweettest  modal-enter" >
                        <div className="">
                            <div className="modal-view">
                                <div className="modal-header">
                                    <button className="" onClick={toggleTest} id="tweet-close">
                                        <svg viewBox="0 0 24 24" className="back-button ">
                                            <g>
                                                <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z">
                                                </path>
                                            </g>
                                        </svg>
                                    </button>
                                </div>

                                <div style={{ color: "red", fontSize: "20px" }} className="mt-2 error-msg d-flex justify-content-center">{errorDiv}</div>


                                <div className="modal-body row ">
                                    <div className="col-1">
                                        <img src={icon} alt="example" className="user-tweet-img" />
                                    </div>

                                    <form id="tweetForm" className="signup col tweet-form" onSubmit={(e) => handleSubmit(e)} >

                                        <div className="view">
                                            <textarea

                                                id="tweet"
                                                name="tweet"
                                                type="text"
                                                value={tweetContent}
                                                onChange={handleChange}
                                                className=" edit-input "
                                                maxLength="280"
                                                rows={rows}
                                                placeholder="Any Hot Takes?"
                                                required
                                            />


                                            {Object.keys(tweetErr).map((key) => {
                                                return <div style={{ color: "red" }} className="error-msg"> {tweetErr[key]} </div>
                                            })}
                                        </div>

                                        <div className="d-flex flex-row mt-1">
                                            <div className="container d-flex">
                                                <span><span style={{ color }}>{count}</span>/280</span>
                                                {/* <span id="show">0</span><span>/280</span> */}
                                                <div className=" ml-4">
                                                    <FontAwesomeIcon
                                                        size="lg"
                                                        icon={faSmile}
                                                        className="mt-2 icon-active"
                                                        onClick={toggleEmojiPicker}
                                                    />
                                                </div>
                                            </div>

                                            {showEmojiPicker ? <Emoji/> : null}

                                            <button
                                                id="submit-btn"
                                                className="btn login-submit btn-accent-outline rounded-pill   "
                                                type="submit"
                                            // onClick={handleSubmit}
                                                disabled={disabled}       //button disabler
                                            >
                                                {tweetLoading ? <TweetLoading /> : "Tweet"}
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            
            {/* <Compose/> */}
            {/* col-sm-2 */}
            <div><Link className="text nav-logo fixed pl-2 " to="/home">
                <svg width="26px" height="40px" viewBox="0 0 256 209" version="1.1" preserveAspectRatio="xMidYMid">
                    <g>
                        <path d="M256,25.4500259 C246.580841,29.6272672 236.458451,32.4504868 225.834156,33.7202333 C236.678503,27.2198053 245.00583,16.9269929 248.927437,4.66307685 C238.779765,10.6812633 227.539325,15.0523376 215.57599,17.408298 C205.994835,7.2006971 192.34506,0.822 177.239197,0.822 C148.232605,0.822 124.716076,24.3375931 124.716076,53.3423116 C124.716076,57.4586875 125.181462,61.4673784 126.076652,65.3112644 C82.4258385,63.1210453 43.7257252,42.211429 17.821398,10.4359288 C13.3005011,18.1929938 10.710443,27.2151234 10.710443,36.8402889 C10.710443,55.061526 19.9835254,71.1374907 34.0762135,80.5557137 C25.4660961,80.2832239 17.3681846,77.9207088 10.2862577,73.9869292 C10.2825122,74.2060448 10.2825122,74.4260967 10.2825122,74.647085 C10.2825122,100.094453 28.3867003,121.322443 52.413563,126.14673 C48.0059695,127.347184 43.3661509,127.988612 38.5755734,127.988612 C35.1914554,127.988612 31.9009766,127.659938 28.694773,127.046602 C35.3777973,147.913145 54.7742053,163.097665 77.7569918,163.52185 C59.7820257,177.607983 37.1354036,186.004604 12.5289147,186.004604 C8.28987161,186.004604 4.10888474,185.75646 0,185.271409 C23.2431033,200.173139 50.8507261,208.867532 80.5109185,208.867532 C177.116529,208.867532 229.943977,128.836982 229.943977,59.4326002 C229.943977,57.1552968 229.893412,54.8901664 229.792282,52.6381454 C240.053257,45.2331635 248.958338,35.9825545 256,25.4500259" fill="#55acee"></path>
                    </g>
                </svg>
            </Link>
            </div>
            {user}
            <div className="fixed phone-header mt-5">

                {user === true ?
                <Link className={path === '/home' ? "d-flex header-link-active" : "d-flex header-link"} to="/home">
                    <div className="  d-flex pl-2 mt-2" >
                        <div>
                            <svg viewBox="0 0 26 26" className="icon mr-2">
                                <g>
                                    <path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.815-.44L4.7 19.963c.214 1.215 1.308 2.062 2.658 2.062h9.282c1.352 0 2.445-.848 2.663-2.087l1.626-11.49.818.442c.364.193.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 12.133c-.107.606-.703.822-1.18.822H7.36c-.48 0-1.075-.216-1.178-.798L4.48 7.69 12 3.628l7.522 4.06-1.7 12.015z"></path>
                                    <path d="M8.22 12.184c0 2.084 1.695 3.78 3.78 3.78s3.78-1.696 3.78-3.78-1.695-3.78-3.78-3.78-3.78 1.696-3.78 3.78zm6.06 0c0 1.258-1.022 2.28-2.28 2.28s-2.28-1.022-2.28-2.28 1.022-2.28 2.28-2.28 2.28 1.022 2.28 2.28z"></path>
                                </g>
                            </svg>
                        </div>
                        <p className="header-title " style={{ fontWeight: 700 }}>Home</p>
                    </div>
                </Link>
                    : null}

                <Link to="/explore" className={path === '/explore' ? "d-flex header-link-active" : "d-flex header-link"}>
                    <div className=" d-flex pl-2 mt-2">
                        <div>
                            <svg viewBox="0 0 26 26" className="icon mr-2">
                                <g>
                                    <path d="M22.06 19.94l-3.73-3.73C19.38 14.737 20 12.942 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c1.943 0 3.738-.622 5.21-1.67l3.73 3.73c.292.294.676.44 1.06.44s.768-.146 1.06-.44c.586-.585.586-1.535 0-2.12zM11 17c-3.308 0-6-2.692-6-6s2.692-6 6-6 6 2.692 6 6-2.692 6-6 6z"></path>
                                </g>
                            </svg>
                        </div>
                        <p className="header-title " style={{ fontWeight: 700 }}>Explore</p>
                    </div>
                </Link>

                {user === true ?
                    <Link to="#" className="d-flex header-link">
                        <div className=" d-flex pl-2 mt-2">
                            <div>
                                <svg viewBox="0 0 26 26" className="icon mr-2">
                                    <g>
                                        <path d="M19.25 3.018H4.75C3.233 3.018 2 4.252 2 5.77v12.495c0 1.518 1.233 2.753 2.75 2.753h14.5c1.517 0 2.75-1.235 2.75-2.753V5.77c0-1.518-1.233-2.752-2.75-2.752zm-14.5 1.5h14.5c.69 0 1.25.56 1.25 1.25v.714l-8.05 5.367c-.273.18-.626.182-.9-.002L3.5 6.482v-.714c0-.69.56-1.25 1.25-1.25zm14.5 14.998H4.75c-.69 0-1.25-.56-1.25-1.25V8.24l7.24 4.83c.383.256.822.384 1.26.384.44 0 .877-.128 1.26-.383l7.24-4.83v10.022c0 .69-.56 1.25-1.25 1.25z"></path>
                                    </g>
                                </svg>
                            </div>
                            <p className="header-title " style={{ fontWeight: 700 }}>Messages</p>
                        </div>
                    </Link>
                    : null}

                {user ===true ?
                    <Link className={path === `/u/${username}` || path === '/edit' ? "d-flex header-link-active" : "d-flex header-link"} to= {`/u/${username}`}>
                        <div className=" d-flex pl-2 mt-2" >
                            <div>
                                <svg viewBox="0 0 26 26" className="icon mr-2">
                                    <g>
                                        <path d="M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.17c-.272 2.022-.008 3.46.806 4.39.968 1.107 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.255-.223-2.71-.743c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.242.017.48-.12.654z"></path>
                                    </g>
                                </svg>
                            </div>
                            <p className="header-title " style={{ fontWeight: 700 }}>Profile</p>
                        </div>
                    </Link>
                    : null}

                <Link to="#" className="d-flex more header-link">
                    <div className=" d-flex pl-2 mt-2">
                        <div>
                            <svg viewBox="0 0 26 26" className="icon mr-2">
                                <g>
                                    <circle cx="17" cy="12" r="1.5"></circle>
                                    <circle cx="12" cy="12" r="1.5"></circle>
                                    <circle cx="7" cy="12" r="1.5"></circle>
                                    <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path>
                                </g>

                            </svg>
                        </div>
                        <p className="header-title "
                            style={{ fontWeight: 700 }}
                            onClick={moreToggle}
                            ref={tweetRef}
                        >
                            More
                            </p>
                    </div>
                </Link>

                {moreModal ? <MoreModal /> : null}

                {user ===true ?
                    <div className="d-flex tweet-btn" >
                        <div className=" d-flex pl-2">
                            <div>

                                <div
                                    // to="/compose"
                                    id="tweet-button"
                                    className="btn tweet-submit btn-accent rounded-pill mt-3 "
                                    // onClick={tweetToggle}
                                    onClick={toggleTest}

                                >
                                    <div
                                        className="tweet-text"
                                        style={{ fontWeight: 700 }}
                                    >
                                        Tweet
                                    </div>
                                <FontAwesomeIcon icon={faFeatherAlt} className="tweet"/>

                        </div>
                            </div>
                        </div>
                    </div>
                    : null}



                {user ===true ?
                    <button className="user-data d-flex row " onClick={userToggle} ref={ref}>
                        {userModal ? <UserModal /> : null}
                        <img src={icon} alt="example" className="user-data-img" />

                        <div className="col user-data-text">
                            <div className="text">{fullname}</div>
                            <div>
                                <span>@{username}</span>
                            </div>
                        </div>

                    </button>
                    : null}

<ThemeToggle className="mt-4"/>
            </div>
        </header >
    );
}