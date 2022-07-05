import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Loader from "react-loader-spinner";
import { useParams, useHistory, Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
// import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
// import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
// import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
// import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import { UserContext } from '../Contexts/UserContext';

export default function Likes({ IDtoTweets }) {
    let history = useHistory()
    const { user } = useParams()
    TimeAgo.addLocale(en);   //for the time ago


    const [tweetLoading, setTweetLoading] = useState(true);
    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets
    const [noLikes, setNoLikes] = useState(false);
    const [noAccountDiv, setNoAccountDiv] = useState(false)

    let icon = "https://avatars.dicebear.com/api/gridy/" + user + ".svg";

    useEffect(() => {   //fetching data for logged in users


        IDtoTweets && axios.get(`/likes/user/${IDtoTweets}`) //fetching all tweets from a given user
            .then((res) => {
                setTweets(res);
                console.log(res.data);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setNoLikes(true);
                }
            }).finally(() => {
                setTweetLoading(false);

            });


    }, [user, IDtoTweets]);

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

    const NoLikes = () => {        //only shown when user has no tweets
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>This user hasn't made any likes yet</span>

        </div>;
    };


    return (
        <div>
            {tweetLoading ? <Loading /> : null}
            {noLikes ? <NoLikes /> : null}
            {tweets.data.map((item) => {
                // console.log(item.ogtweet[0])
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
