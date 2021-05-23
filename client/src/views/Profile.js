import React, { useState, useEffect, useRef, useContext } from 'react';
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NoAccount from '../components/NoAccount';
import OutsideClick from '../components/OutsideClick';
import Likes from './Likes';
import Retweets from './Retweets';
import Tweets from './Tweets';
import deer from '../images/test.jpg';
import unf1 from '../images/unf1.jpg';
import unf2 from '../images/unf2.jpg';
import axios from 'axios';
import Loader from "react-loader-spinner";
import { Link, useParams, useHistory, useLocation, Redirect } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { UserContext } from '../Contexts/UserContext';

export default function Profile() {
    const [user1] = useContext(UserContext);
    const [serverError, setserverError] = useState(false);

    const [datejoined, setDatejoined] = useState('');

    const [disabled, setDisabled] = useState(false);    // button disabler during request

    const [profile, setProfile] = useState([{ fullname: '', username: '', bio: '', followers: 0, following: 0, isfollowedbyme: false }]);  //display user data

    const [tweetCount, setTweetCount] = useState(0);

    const [noTweets, setNoTweets] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    const [userID, setUserID] = useState('');

    const [userNotFound, setUserNotFound] = useState(false);

    const [loading, setLoading] = useState(false);

    const [noAccountDiv, setNoAccountDiv] = useState(false); //shows modal that tells user they need to sign/log in

    const { username } = useParams();


    const [showLike, setShowLike] = useState(false);    // test for showing likes page

    const [showTweets, setShowTweets] = useState(true);  //showing main tweets page, on refresh this always shows

    const [showRetweets, setShowRetweets] = useState(false);     //showing retweets

    let icon = "https://avatars.dicebear.com/api/identicon/" + username + ".svg";

    let history = useHistory();

    const internalError = () => {       //redirect when there is a server error
        setserverError(true);
    };

    // function getData() {
    //     //loggedIn ? axios.get('/profile/mine') : 

    // }

    useEffect(() => {   //fetching data for logged in users
        window.scroll(0, 0)
        setLoading(true)

        axios.get(`/profile/user/${username}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0]);
                setUserID(res.data[0]._id);
                // getTweets(res.data[0]._id);
                console.log(res.data);
                let date = new Date(res.data[0].datejoined);
                let finalDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(date);
                setDatejoined(finalDate);
                document.title = `TwitClone - @${username}`;

            })
            .catch((error) => {

                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {

                    setUserNotFound(true);
                    setShowTweets(false);
                    document.title = "TwitClone - User Not Found!!";
                    // Error(user);
                }
            }).finally(() => {
                setLoading(false);
            });

        setNoTweets(false);

    }, [username]);

    function UpdateData() {
        setLoading(true)
        axios.get(`/profile/user/${username}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0]);
                setUserID(res.data[0]._id);
                // console.log(res.data)
                let date = new Date(res.data[0].datejoined);
                let finalDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(date);
                setDatejoined(finalDate);
                document.title = `TwitClone - @${username}`;

                setButtonLoading(false);
                setDisabled(false);
            })
            .catch((error) => {

                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setLoading(false);
                    setUserNotFound(true);
                    document.title = "TwitClone - User Not Found!!";
                    // Error(user);
                }
            }).finally(() => {
                setLoading(false)
            })
    }

    const ButtonLoading = () => {    // loader for Follow button 

        // let x = localStorage.getItem("accent") || 'grey'

        return <div className="d-flex justify-content-center " style={{ marginTop: '-10%' }}>
            <Loader type="ThreeDots"
                color="grey"
                height={40}
                width={40}
            />

        </div>;
    };

    const Loading = () => {

        let x = localStorage.getItem("accent") || 'grey';

        return <div className="accent d-flex justify-content-center ">
            <Loader type="TailSpin"
                color={x}
                height={50}
                width={50}
            />

        </div>;
    };

    const NoTweets = () => {        //only shown when user has no tweets
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>This user hasn't made any tweets yet</span>

        </div>;
    };


    const ref = useRef();   //clicking outside closes modal

    OutsideClick(ref, () => {
        // console.log("yep cock");
    });

    const UserNotFound = () => {
        return <div className="d-flex justify-content-center p-2 view row">
            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}> {username}?, never heard of them... </span>
        </div>;
    };

    const handleFollow = () => {
        setDisabled(true);
        setButtonLoading(true);
        axios.post(`/follows/${userID}`)
            .then((res) => {
                UpdateData();
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
                err.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem");
                setButtonLoading(false);
                setDisabled(false);
            })
            .finally(() => {
                // setDisabled(false)
                // setButtonLoading(false)
                setTimeout(() => {
                    setNoAccountDiv(false);
                }, 2000);
            });

    };

    const handleUnfollow = () => {
        setDisabled(true);
        setButtonLoading(true);
        axios.delete(`/follows/${userID}`)
            .then((res) => {
                UpdateData();
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
                err.response.status === 401 ? setNoAccountDiv(true) : console.log("no acc div problem");
                setButtonLoading(false);
                setDisabled(false);
            })
            .finally(() => {
                // setDisabled(false)
                // setButtonLoading(false)
                setTimeout(() => {
                    setNoAccountDiv(false);
                }, 2000);
            });
    };

    const FollowingLink = () => {
        if (user1.username) {
            history.push(`/u/${profile.username}/following`);
        } else {
            setNoAccountDiv(true);
            setTimeout(() => {
                setNoAccountDiv(false);
            }, 2000);
        }
    };

    const FollowerLink = () => {
        if (user1.username) {
            history.push(`/u/${profile.username}/followers`);
        } else {
            setNoAccountDiv(true);
            setTimeout(() => {
                setNoAccountDiv(false);
            }, 2000);
        }
    };


    let location = useLocation();
    let path = location.pathname;
    let path1 = path.split('/u/');
    let userPath = path1[1];

    TimeAgo.addLocale(en);   //for the time ago



    let path0 = location.pathname;
    let path5 = path0.split(`/u/${profile.username}`);
    let finalPath = path5[1];

    const likePage = () => {
        setShowLike(true);
        setShowTweets(false);
        setShowRetweets(false);
    };

    const tweetsPage = () => {
        setShowLike(false);
        setShowTweets(true);
        setShowRetweets(false);
    };

    const retweetsPage = () => {
        setShowTweets(false);
        setShowLike(false);
        setShowRetweets(true);
    };




    return (
        <div className="App general" >
            <div className="container  " >
                <div className="row " >

                    {noAccountDiv && <NoAccount currentState={noAccountDiv} />}
                    {serverError && <Redirect to="/Error" />}
                    <Header />

                    <div className="col main-view phone-home " >
                        {loading ? <Loading /> :
                            <>
                                <div className="row profile-header view mt-1">

                                    <div className=" col row ">
                                        <div className="ml-2 col-1.5">
                                            <BackButton />
                                        </div>
                                        <div className="col ">
                                            <div >
                                                <strong className="text" style={{ fontSize: '20px' }}>{userNotFound ? "Profile" : profile.fullname}</strong>
                                            </div>
                                            <span style={{ fontSize: '15px' }}>{!userNotFound && tweetCount}  {userNotFound ? null : tweetCount === 1 ? "Tweet" : "Tweets"} </span>
                                        </div>
                                    </div>
                                </div>


                                <div className=" banner row" >
                                    <img src={!userNotFound ? deer : unf2} alt="example" className="header-photo " />

                                    <div className="p-2  col ">
                                        <div className="">
                                            <img src={userNotFound === false ? icon : unf1} alt="example" className="profile-logo" />

                                            <div className="banner-right ">

                                                {userNotFound || !user1.loggedin ? null :
                                                    user1.username === userPath ?
                                                        <Link
                                                            to={`/u/${profile.username}/edit`}
                                                            className="btn login-submit banner-edit btn-accent rounded-pill mt-1 "
                                                            type="submit"
                                                        >
                                                            Edit Profile
                                                </Link>
                                                        :
                                                        profile.isfollowedbyme === true ?
                                                            <div className="banner-right" onClick={() => handleUnfollow()}>
                                                                <button
                                                                    className="btn login-submit banner-edit btn-accent rounded-pill mt-1"
                                                                    type="submit"
                                                                    disabled={disabled}
                                                                >
                                                                    {buttonLoading ? <ButtonLoading /> : "Following"}
                                                                </button>
                                                            </div>
                                                            :
                                                            <div className="banner-right" onClick={() => handleFollow()}>
                                                                <button
                                                                    className="btn login-submit banner-edit btn-accent-outline rounded-pill mt-1"
                                                                    type="submit"
                                                                    disabled={disabled}
                                                                >
                                                                    {buttonLoading ? <ButtonLoading /> : "Follow"}
                                                                </button>
                                                            </div>

                                                }

                                            </div>

                                        </div>

                                        <div className="p-2 col">

                                            <strong style={{ fontWeight: 700 }}>{userNotFound ? `@${username}` : profile.fullname}</strong>
                                            <p><span >{userNotFound ? null : `@${profile.username}`}</span></p>

                                            <div className="mt-1">
                                                {profile.bio}
                                            </div>

                                            {!userNotFound &&
                                                <div className="mt-1">
                                                    <span>
                                                        <svg viewBox="0 0 24 24" className="bio-icon">
                                                            <g>
                                                                <path d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z">
                                                                </path>
                                                                <circle cx="7.032" cy="8.75" r="1.285"></circle>
                                                                <circle cx="7.032" cy="13.156" r="1.285"></circle>
                                                                <circle cx="16.968" cy="8.75" r="1.285"></circle>
                                                                <circle cx="16.968" cy="13.156" r="1.285"></circle>
                                                                <circle cx="12" cy="8.75" r="1.285"></circle>
                                                                <circle cx="12" cy="13.156" r="1.285"></circle>
                                                                <circle cx="7.032" cy="17.486" r="1.285"></circle>
                                                                <circle cx="12" cy="17.486" r="1.285"></circle>
                                                            </g>
                                                        </svg>
                                            &nbsp;
                                            Joined {datejoined}
                                                    </span>
                                                </div>
                                            }

                                            {!userNotFound &&
                                                <div className="mt-1 d-flex">
                                                    <div className="flw-flw name-link d-flex" onClick={FollowingLink}>
                                                        <div style={{ fontWeight: 700 }}>
                                                            {profile.following}&nbsp;
                                                </div>
                                                        <span>Following</span>
                                                    </div>
                                            &nbsp;&nbsp;&nbsp;
                                            <div className="flw-flw name-link d-flex" onClick={FollowerLink}>
                                                        <div style={{ fontWeight: 700 }}> {profile.followers} &nbsp;</div><span >Followers</span>
                                                    </div>
                                                </div>
                                            }

                                            {!userNotFound &&
                                                <div className="row d-flex view mt-3" style={{ textAlign: 'center', fontWeight: '700' }}>
                                                    <div onClick={tweetsPage} className={showTweets ? "w-35 follow-tab-active" : "w-35 follow-tab"} style={{ width: '33.3%' }}>
                                                        <div className="p-3 ">
                                                            Tweets
                                            </div>
                                                    </div>
                                                    <div onClick={retweetsPage} className={showRetweets ? "w-35 follow-tab-active" : "w-35 follow-tab"} style={{ width: '33.3%' }}>
                                                        <div className="p-3 ">
                                                            Retweets
                                            </div>
                                                    </div>
                                                    <div onClick={likePage} className={showLike ? "w-35 follow-tab-active" : "w-35 follow-tab"} style={{ width: '33.3%' }}>

                                                        <div className="p-3 ">
                                                            Likes
                                                </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </>
                        }

                        {userNotFound && <UserNotFound />}
                        {noTweets && <NoTweets />}
                        {showLike && <Likes IDtoTweets={userID} />}
                        {showTweets && <Tweets
                            fullname={profile.fullname}
                            username={profile.username}
                            tweetCountFromTweets={setTweetCount}
                            IDtoTweets={userID}
                        />
                        }
                        {showRetweets && <Retweets IDtoTweets={userID} />}

                        {/* {tweets.data.map((item) => (
                            <div className={disableDiv[item._id] ? "p-2 view row main-post-div test" : "p-2 view row main-post-div"} key={item._id}>
                                {userNotFound ? null :
                                    <div className="col-1.5">             
                                        <Link
                                            to={`/u/${profile.username}`}
                                        >
                                            <img src={icon} alt="example" className="user-logo" />
                                        </Link>
                                    </div>
                                }
                                {userNotFound ? null :
                                    <Link to={`/post/${item._id}`} className="col user-name-tweet post-div" >
                                        
                                        <div  >
                                            <div >
                                                <Link
                                                    to={`/u/${profile.username}`}
                                                    className="name-link"
                                                >
                                                    <strong >{profile.fullname}</strong>&nbsp;
                                            </Link>
                                                <span>@{profile.username}</span>
                                            &nbsp; <span>·</span> &nbsp;
                                            <span>
                                                    <ReactTimeAgo date={item.dateposted} locale="en-US" timeStyle="twitter" />
                                                </span>
                                            </div>
                                            <div className="post-link">
                                                <p>{item.content} </p>
                                            </div>
                                        </div>
                                        <div className="interact-row d-flex ">
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
                                        </div>
                                        <Interactive
                                            className="mt-2"
                                            session={sessionName}
                                            id={item._id}
                                            comments={item.comments}
                                            retweets={item.retweets}
                                            likes={item.likes}
                                            likesByMe={item.isLikedbyme}
                                            passChildData={setchildData}
                                        />
                                    </Link>
                                }
                            </div>
                        ))} */}

                    </div>

                    <Sidebar />
                </div>
            </div >
        </div >
    );
}