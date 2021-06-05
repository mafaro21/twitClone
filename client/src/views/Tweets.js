import React, { useState, useEffect, useContext } from 'react';
import Interactive from '../components/Interactive';
import axios from 'axios';
import Loader from "react-loader-spinner";
import { Link, useHistory } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { UserContext } from '../Contexts/UserContext';
import NoAccount from '../components/NoAccount';

export default function Tweets({ tweetCountFromTweets, IDtoTweets, username, fullname }) {
    const [user] = useContext(UserContext);

    const [tweetLoading, setTweetLoading] = useState(true);
    const [noTweets, setNoTweets] = useState(false);
    const [deleteId, setDeleteId] = useState(0)

    const [tweetCount, setTweetCount] = useState(0);
    const [tweets, setTweets] = useState({ data: [] });// for displaying user tweets
    const [childData, setchildData] = useState(false);   //boolean from interactve.js on whether to refresh data
    const [noAccountDiv, setNoAccountDiv] = useState(false); //shows modal that tells user they need to sign/log in
    let history = useHistory();

    let icon = "https://avatars.dicebear.com/api/gridy/" + username + ".svg";



    useEffect(() => {   //fetching data for logged in users

        setTweets({ data: [] }); //refresh tweets state when going to another user's profile


        setTweetLoading(true);

        IDtoTweets && axios.get(`/tweets/user/${IDtoTweets}`) //fetching all tweets from a given user
            .then((res) => {
                setTweets(res);
                setNoTweets(false);
                tweetCountFromTweets(res.data.length);
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setNoTweets(true);
                }
            }).finally(() => {
                setTweetLoading(false);
            });
        // }



    }, [IDtoTweets]);

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };

    function UpdateData() {


        IDtoTweets && axios.get(`/tweets/user/${IDtoTweets}`) //fetching all tweets from a given user
            .then((res) => {
                setTweets(res);
                setNoTweets(false);
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    setNoTweets(true);
                }
            });
    }


    if (childData) {
        UpdateData();
        setchildData(false);
    }

    const NoTweets = () => {        //only shown when user has no tweets
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>This user hasn't made any tweets yet</span>

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

    return (
        <div>
            {noTweets && <NoTweets />}
            {noAccountDiv && <NoAccount currentState={noAccountDiv} />}

            {tweetLoading || IDtoTweets === null ? <Loading /> :
                tweets.data.map((item) => (
                    <div className={item._id === deleteId ? "p-2 view row main-post-div delete-div" : "p-2 view row main-post-div modal-enter"} key={item._id}>

                        <div className="col-1.5">              {/* <--- user avi */}
                            <Link
                                to={`/u/${username}`}
                            >
                                <img src={icon} alt="example" className="user-logo" />
                            </Link>

                        </div>

                        <Link to={`/post/${item._id}`} className="col user-name-tweet post-div" >
                            {/* <--- user content */}
                            <div  >
                                <div >
                                    <Link
                                        to={`/u/${username}`}
                                        className="name-link"
                                    >
                                        <strong >{fullname}</strong>&nbsp;
                                            </Link>
                                    <span>@{username}</span>

                                            &nbsp; <span>·</span> &nbsp;
                                            <span>
                                        <ReactTimeAgo date={item.dateposted} locale="en-US" timeStyle="twitter" />
                                    </span>
                                </div>

                                <div className="post-link">
                                    <p>{item.content}</p>
                                </div>
                            </div>


                            <Interactive
                                className="mt-2"
                                username={username}
                                id={item._id}
                                comments={item.comments}
                                retweets={item.retweets}
                                likes={item.likes}
                                likesByMe={item.isLikedbyme}
                                passChildData={setchildData}
                                retweetsByMe={item.isRetweetbyme}
                                deleteID={setDeleteId}
                                logInFirst={setNoAccountDiv}
                            />
                        </Link>

                    </div>
                ))}

        </div>
    );
}
