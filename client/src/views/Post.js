import React, { useState, useEffect } from 'react'
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Interactive from '../components/Interactive';
import axios from 'axios';
import Loader from "react-loader-spinner";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'
import { Link, useHistory } from 'react-router-dom';
// import { Redirect } from 'react-router-dom';
// import Error from '../views/Error';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

export default function Post() {

    const [isLiked, setisLiked] = useState(false)
    const [tweets, setTweets] = useState({ data: [] })            // for displaying tweets and other info
    const [loading, setLoading] = useState(true);      // loading animation
    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [commentDisabled, setCommentDisabled] = useState(true)

    const [isLikedbyMe, setIsLikedbyMe] = useState(0)

    const [comment, setComment] = useState('')

    const [count, setCount] = useState(0)

    const [color, setColor] = useState("grey")

    const [commentReply, setCommentReply] = useState(false)

    const [hoverDiv, setHoverDiv] = useState(false)

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker)

    const [rows, setRows] = useState(1)

    const [minRows] = useState(1)

    const [maxRows] = useState(8)

    let history = useHistory()

    const handleLike = (id) => {  //for liking and unliking posts

        setDisabled(true)

        if (!isLiked && isLikedbyMe === 0) {
            setisLiked(true)

            axios.post(`/likes/${id}`)
                .then((res) => {
                    // console.log(res.data)
                    setDisabled(false)
                    UpdateData()
                })
                .catch((error) => {
                    console.error(error)
                }).finally(() => {
                    setDisabled(false);
                });

        } else {
            setisLiked(false)

            axios.delete(`/likes/${id}`)
                .then((res) => {
                    // console.log(res.data)
                    setDisabled(false)
                    UpdateData()
                })
                .catch((error) => {
                    console.error(error)
                }).finally(() => {
                    setDisabled(false);
                });
        }
    }

    const ForId = () => {
        // let fetchid = useLocation()
        let idPath = document.location.pathname;
        let finalId = idPath.split("/post/");
        let sendId = finalId[1];
        // console.log(sendId)
        // setId(sendId)
        return sendId;
    }

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
        // return <Redirect to="/Error" />
    }

    const Error = () => {       //redirect when there is a server error
        return history.push("/NotFound404");
        // return <Redirect to={Error} />
    }


    useEffect(() => {   //fetching data for logged in users

        window.scrollTo(0, 0)       //scroll to top of page when it loads

        const getId = ForId()

        if (getId !== undefined) {
            axios.get(`/tweets/${getId}`)
                .then((res) => {
                    setTweets(res);
                    setLoading(false)
                    // console.log(res.data)
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response.status === 500) {
                        internalError();
                    }
                    else if (error.response.status === 404) {
                        Error()
                    }
                }).finally(() => {
                    setLoading(false);
                })


            axios.get(`/likes/me/${getId}`)
                .then((res) => {
                    setIsLikedbyMe(res.data.count)
                    // console.log(res.data.count)

                })
                .catch((error) => {
                    console.error(error)
                })
        }


        document.title = "TwitClone"; //change DOCTITLE according to username.

    }, []); //tweets

    // const wordCount = () => {   //live word counter
    //     document.getElementById("tweet").addEventListener('input', function () {
    //         var text = this.value,
    //             count = text.trim().replace(/\s+/g, ' ').length;

    //         if (count === 280) {
    //             document.getElementById('show').style.color = "red"
    //         } else if (count >= 250) {
    //             document.getElementById('show').style.color = "#FF8000"
    //         } else if (count >= 200) {
    //             document.getElementById('show').style.color = "#FFB400"
    //         } else if (count >= 150) {
    //             document.getElementById('show').style.color = "#FFF800"
    //         } else {
    //             document.getElementById('show').style.color = "grey"
    //         }

    //         if (count <= 0) {// used to disable button if textarea is empty
    //             document.getElementById("submit-btn").disabled = true;
    //         } else {
    //             document.getElementById("submit-btn").disabled = false;
    //         }

    //         document.getElementById('show').textContent = count;

    //     }
    //     )
    // }


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
            setCommentDisabled(false)
        } else {
            setCommentDisabled(true)
        }
    }

    // let addEmoji = (emoji) => {
    //     setComment(comment => (comment + emoji.native))
    // }


    const Loading = () => {        //the loading div

        return <div className="d-flex justify-content-center mt-3">
            <Loader type="TailSpin"
                color="orange"
                height={60}
                width={60}
            />

        </div>
    }

    const HoverDiv = (id) => {

        setTimeout(() => {
            if (!hoverDiv[id]) {
                setHoverDiv(prevHoverDiv => ({
                    ...prevHoverDiv,
                    [id]: !setHoverDiv[id]
                }));
            }
        }, 700);

        let flm = ''
        let usm = ''

        return <div className="show-detail p-3 ">
            <div>
                <img src={icon} alt="example" className="user-logo " />
            </div>
            <div className="show-detail-1 ">
                <div >
                    <strong>{flm}</strong>
                </div>
                <div>
                    <span>@{usm}</span>
                </div>
                <div className="mt-2 ">
                    {/* {profile.bio} */}
                </div>
                {/* <div className="mt-1">
                    <span style={{ fontWeight: 700 }}>{profile.following}</span>&nbsp;<span>Following</span>
                        &nbsp;&nbsp;&nbsp;
                    <span style={{ fontWeight: 700 }}>{profile.followers}</span> &nbsp;<span>Followers</span>
                </div> */}
            </div>

        </div>

    }

    TimeAgo.addLocale(en)

    let icon = "https://avatars.dicebear.com/api/identicon/3.svg";

    const UpdateData = () => {
        const getId = ForId()

        axios.get(`/tweets/${getId}`)
            .then((res) => {
                setTweets(res);
                // console.log(res.data)
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) {
                    internalError();
                }
                else if (error.response.status === 404) {
                    Error()
                }
            });

        axios.get(`/likes/me/${getId}`)
            .then((res) => {
                setIsLikedbyMe(res.data.count)
                // console.log(res.data.count)

            })
            .catch((error) => {
                console.error(error)
            });
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

    return (
        <div className="general" >
            <Navbar />
            <div className="container App " >
                <div className="row " >

                    <Header />

                    <div className="col main-view  phone-home w-100 " >
                        <div className="row profile-header view">

                            <div className="p-2  col row " id="top">
                                <div className="ml-2 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div className="">
                                        <strong>Spicy Take</strong>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {loading ? <Loading /> : null}
                        {tweets.data.map((item) => {
                            let date = new Date(item.dateposted);
                            // let localeDate = date.toLocaleDateString();
                            let months = ['January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'];
                            let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                            let am_pm = date.getHours() >= 12 ? " PM" : " AM"
                            let finalDate = hours + ":" + date.getMinutes()
                                + am_pm + " · " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

                            return <div>
                                <div className="p-2  row" key={item._id}>
                                    <div className="col-1.5">              {/* <--- user avi */}
                                        <Link
                                            to={`/u/${item.User[0].username}`}
                                            onMouseEnter={() => HoverDiv(item._id)}
                                            onMouseLeave={() => setHoverDiv(false)}
                                        >
                                            <img
                                                src={`https://avatars.dicebear.com/api/identicon/${item.User[0].username}.svg`}
                                                alt="example"
                                                className="user-logo"
                                            />
                                        </Link>

                                        {hoverDiv[item._id] ? <HoverDiv flm={item.User[0].fullname} usm={item.User[0].username} /> : null}
                                    </div>
                                    <div className="col user-name-tweet" >                   {/* <--- user content */}
                                        <div className=" ">
                                            <div>
                                                <Link
                                                    to={`/u/${item.User[0].username}`}
                                                    onMouseEnter={() => HoverDiv(item._id)}
                                                    onMouseLeave={() => setHoverDiv(false)}
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

                                            <button className="col retweet">
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
                            </div>
                        })}

                        <div className="p-2 post-view row mt-3">
                            <div className="col-0.5">              {/* <--- user avi */}
                                <img src={icon} alt="example" className={commentReply ? "user-logo mt-2" : "user-logo"} />
                            </div>

                            <form className="signup col tweet-form ">
                                {/* onSubmit={(e) => handleSubmit(e)} */}
                                {tweets.data.map((item) => (
                                    <div className="">

                                        {commentReply ?
                                            <span>Replying to
                                                <Link to={`/u/${item.User[0].username}`} className="ml-1">
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
                                        {/* {Object.keys(fullnameErr).map((key) => {
                                        return <div style={{ color: "red" }} className="error-msg"> {fullnameErr[key]} </div>
                                    })} */}


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
                                        id="submit-btn"
                                        className="btn login-submit btn-outline-primary rounded-pill "
                                        type="submit"
                                        // onClick={handleSubmit}
                                        disabled={commentDisabled}       //button disabler
                                    >
                                        Tweet
                                    </button>
                                </div>
                            </form>

                        </div>


                        <div className="p-2 view row mt-3" >             {/* <--- standard tweet*/}
                            <div className="col-1.5">              {/* <--- user avi */}
                                <img src={icon} alt="example" className="user-logo" />
                            </div>
                            <div className="col user-name-tweet">                   {/* <--- user content */}
                                <div className="user-content">
                                    {/* <strong>{fullname}</strong> &nbsp; <span>@{username}</span> */}
                                </div>
                                <p></p>

                                <Interactive />

                            </div>
                        </div>

                    </div>

                    <Sidebar />

                </div>
            </div>
        </div >

    );
}