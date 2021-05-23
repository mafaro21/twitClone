import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Loader from "react-loader-spinner";
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
// import { UserContext } from '../Contexts/UserContext';
import Interactive from '../components/Interactive';

export default function Retweets({ IDtoTweets }) {
    let location = useLocation()
    let history = useHistory()
    const { user } = useParams()
    TimeAgo.addLocale(en);   //for the time ago

    const [tweetLoading, setTweetLoading] = useState(true);
    const [profile, setProfile] = useState([{ fullname: '', username: '', bio: '', followers: 0, following: 0, isfollowedbyme: false }])  //display user data

    const [tweetCount, setTweetCount] = useState(0);
    const [userNotFound, setUserNotFound] = useState(false)
    const [datejoined, setDatejoined] = useState('');
    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets
    const [noRetweets, setNoRetweets] = useState(false);
    const [userID, setUserID] = useState('')
    const [childData, setchildData] = useState(false)   //boolean from interactve.js on whether to refresh data


    useEffect(() => {   //fetching data for logged in users


        setTweets({ data: [] }) // this is to refresh the state to make sure someone else's retweets don't show up on another account

        setTweetLoading(true)

        IDtoTweets && axios.get(`/retweets/${IDtoTweets}`) //fetching all tweets from a given user
            .then((res) => {
                setNoRetweets(false)
                setTweets(res);
                console.log(res.data);
                // console.log(x)
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setNoRetweets(true);
                }
            }).finally(() => {
                setTweetLoading(false);
            });


    }, [user]);

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };
    const Loading = () => {

        let x = localStorage.getItem("accent") || 'grey'

        return <div className="accent d-flex justify-content-center ">
            <Loader type="TailSpin"
                color={x}
                height={50}
                width={50}
            />

        </div>;
    };
    const NoRetweets = () => {        //only shown when user has no tweets
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>This user hasn't made any retweets</span>

        </div>;
    };

    const UpdateData = () => {  //update data after like or deleted tweet
        axios.get(`/profile/user/${user}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0])
                // console.log(res.data)
                let date = new Date(res.data[0].datejoined);
                let months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                let finalDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
                setDatejoined(finalDate)
                document.title = `TwitClone - @${user}`
            })
            .catch((error) => {
                console.error(error)

                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setUserNotFound(true)
                    document.title = `TwitClone - User Not Found!!`
                    // Error(user);
                }
            });

        axios.get(`/tweets/user/${userID}`)
            .then((res) => {
                setTweets(res);
                setTweetCount(res.data.length);
                // console.log(res.data);
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    // setNoTweets(true);
                }
            });


    }


    return (
        <>
            {tweetLoading ? <Loading /> : null}
            {noRetweets ? <NoRetweets /> : null}
            {tweets.data.map((item) => {
                // console.log(item.ogtweet[0])
                let icon = "https://avatars.dicebear.com/api/identicon/" + item.oguser[0].username + ".svg";


                return <div className="p-2 view row main-post-div" >

                    <div className="col-1.5">

                        <img src={icon} alt="example" className="user-logo" />
                    </div>



                    <Link to={`/post/${item.ogtweet[0]._id}`} className="col user-name-tweet post-div" >
                        <div  >
                            <div >
                                <Link
                                    to={`/u/${item.oguser[0].username}`}
                                    className="name-link"
                                >
                                    <strong >{item.oguser[0].fullname}</strong>&nbsp;
                                </Link>
                                <span>@{item.oguser[0].username}</span>

                        &nbsp; <span>·</span> &nbsp;
                        <span>
                                    <ReactTimeAgo date={item.ogtweet[0].dateposted} locale="en-US" timeStyle="twitter" />
                                </span>
                            </div>

                            <div className="post-link">
                                <p>{item.ogtweet[0].content} </p>
                            </div>
                        </div>
                        <Interactive
                            className="mt-2"
                            // session={sessionName}
                            id={item._id}
                            comments={item.ogtweet[0].comments}
                            retweets={item.ogtweet[0].retweets}
                            likes={item.ogtweet[0].likes}
                            likesByMe={item.isLikedbyme}
                            passChildData={setchildData}
                            retweetsByMe={item.isRetweetbyme}
                            username={item.oguser[0].username}
                        />
                    </Link>
                </div>
            })}
        </>
    )
}
