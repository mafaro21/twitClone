import React, { useState, useEffect } from 'react';
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useParams, useHistory, useLocation, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loader from "react-loader-spinner";
import NoAccount from '../components/NoAccount';

export default function Following() {

    const [profile, setProfile] = useState([{ fullname: '', username: '', bio: '', followers: 0, following: 0, isfollowedbyme: false }]);  //display user data

    const [following, setFollowing] = useState({ data: [] });

    const [notFollowing, setNotFollowing] = useState(false);
    const [notAuthorized, setNotAuthorized] = useState(false); // <--------for redirect if notloggedin

    const [loading, setLoading] = useState(true);

    const [noAccountDiv, setNoAccountDiv] = useState(false);

    const { username } = useParams();

    const { history } = useHistory();

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };
    const Error = () => {       //redirect when there is a server error
        return history.push("/NotFound404");
        // return <Redirect to={Error} />
    };


    useEffect(() => {
        axios.get(`/profile/user/${username}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0]);
                let x = res.data[0]._id;
                getFollowing(x);
                document.title = `People followed by @${username} - TwitClone`;
            })
            .catch((error) => {
                console.error(error);

                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    Error();
                }
            });

        async function getFollowing(x) {
            axios.get(`/follows/from/${x}`)
                .then((res) => {
                    setFollowing(res);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err.data);
                    if (err.response.status === 404) {
                        setLoading(false);
                        setNotFollowing(true);
                    } else if (err.response.status === 401) {
                        setLoading(false);
                        setNoAccountDiv(true);
                        setNotAuthorized(true);

                        setTimeout(() => {
                            setNoAccountDiv(false);
                        }, 2000);
                    }
                });

        }
    }, [username]);

    let location = useLocation();
    let path = location.pathname;
    let path1 = path.split(`/u/${profile.username}`);
    let finalPath = path1[1];

    const Loading = () => {        //the loading div
        let x = localStorage.getItem("accent") || 'grey';

        return <div className="d-flex justify-content-center mt-2">
            <Loader type="TailSpin"
                color={x}
                height={50}
                width={50}
            />

        </div>;
    };

    const NotFollowing = () => {
        return <div className="d-flex justify-content-center p-2">
            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}> {username} isn't following anyone.... very picky </span>
        </div>;
    };

    return (
        <div className="App general">
            <div className="container  " >
                <div className="row " >
                    <Header />
                    {noAccountDiv && <NoAccount currentState={noAccountDiv} />}
                    {notAuthorized && <Redirect to={`/u/${username}`} />}
                    <div className="col main-view phone-home " >

                        <div className="row profile-header ">

                            <div className="p-2  col row ">
                                <div className="ml-2 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div >
                                        <strong className="text">{profile.fullname}</strong>
                                    </div>
                                    <div>
                                        <span className="text mb-2" style={{ fontSize: '14px', color: 'grey' }}>@{profile.username}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row d-flex view" style={{ textAlign: 'center', fontWeight: 700 }}>
                            <Link to={`/u/${profile.username}/followers`} className={finalPath === '/followers' ? "w-50 follow-tab-active" : "w-50 follow-tab"}>
                                <p className="p-2 ">
                                    Followers
                                        </p>
                            </Link>
                            <div className={finalPath === '/following' ? "w-50 follow-tab-active" : "w-50 follow-tab"}>
                                <p className="p-2">Following</p>
                            </div>
                        </div>

                        {notFollowing && <NotFollowing />}
                        {loading && <Loading />}
                        {following.data.map((item, i) => {
                            let icon = "https://avatars.dicebear.com/api/identicon/" + item.User[0].username + ".svg";

                            return <Link to={`/u/${item.User[0].username}`} className="p-2 view row main-post-div post-link name-link" key={i}>
                                <div className="col-1.5">              {/* <--- user avi */}
                                    <div>
                                        <img src={icon} alt="example" className="user-logo" />
                                    </div>

                                </div>
                                <div className="col">
                                    <div
                                        style={{ fontWeight: '700' }}
                                        className="name-link"
                                    >
                                        {item.User[0].fullname}
                                    </div>
                                    <div>
                                        <span className="mb-5">@{item.User[0].username}</span>
                                    </div>
                                    <div>{item.User[0].bio}</div>
                                </div>
                            </Link>;
                        })}
                    </div>

                    <Sidebar />
                </div>
            </div>

        </div>
    );
}
