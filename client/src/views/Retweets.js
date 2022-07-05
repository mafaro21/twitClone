import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Loader from "react-loader-spinner";
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
// import { UserContext } from '../Contexts/UserContext';

export default function Retweets({ IDtoTweets }) {
    let history = useHistory()
    const { user } = useParams()
    TimeAgo.addLocale(en);   //for the time ago

    const [tweetLoading, setTweetLoading] = useState(true);

    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets
    const [noRetweets, setNoRetweets] = useState(false);


    useEffect(() => {   //fetching data for logged in users


        setTweets({ data: [] }) // this is to refresh the state to make sure someone else's retweets don't show up on another account

        setTweetLoading(true)

        IDtoTweets && axios.get(`/retweets/user/${IDtoTweets}`) //fetching all tweets from a given user
            .then((res) => {
                setNoRetweets(false)
                setTweets(res);
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


    return (
        <div>
            {tweetLoading ? <Loading /> : null}
            {noRetweets ? <NoRetweets /> : null}
            {tweets.data.map((item) => {
                let icon = "https://avatars.dicebear.com/api/gridy/" + item.oguser[0].username + ".svg";


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
                    </Link>
                </div>
            })}
        </div>
    )
}
