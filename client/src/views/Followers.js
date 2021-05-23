import React, { useState, useEffect } from 'react'
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useParams, useHistory, useLocation, Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import Loader from "react-loader-spinner";
import NoAccount from '../components/NoAccount';

export default function Followers() {

    const [profile, setProfile] = useState([{ fullname: '', username: '', bio: '', followers: 0, following: 0, isfollowedbyme: false }])  //display user data

    const [followers, setFollowers] = useState({ data: [] })

    const [notFollowers, setNoFollowers] = useState(false)
    const [notAuthorized, setNotAuthorized] = useState(false); // <--------for redirect if notloggedin

    const [loading, setLoading] = useState(true)

    const [noAccountDiv, setNoAccountDiv] = useState(false)

    const { username } = useParams()

    const { history } = useHistory()

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };

    let location = useLocation()
    let path = location.pathname
    let path1 = path.split(`/u/${profile.username}`)
    let finalPath = path1[1]

    useEffect(() => {

        axios.get(`/profile/user/${username}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0])
                // console.log(res.data)
                let x = res.data[0]._id
                getFollowers(x)
                document.title = `People following @${username} - TwitClone`
            })
            .catch((error) => {
                console.error(error)

                if (error.response.status === 500) {
                    internalError();
                } else if (error.response.status === 404) {
                    // setTweetLoading(false);
                    // document.title = `TwitClone - User Not Found!!`
                    // Error(user);
                }
            });

        async function getFollowers(x) {
            // console.log(x)
            axios.get(`/follows/to/${x}`)
                .then((res) => {
                    // console.log(res.data)
                    setFollowers(res)
                    setLoading(false)
                })
                .catch((err) => {
                    console.error(err.data)
                    if (err.response.status === 404) {
                        setLoading(false)
                        setNoFollowers(true)
                    } else if (err.response.status === 401) {
                        setLoading(false)
                        setNoAccountDiv(true)
                        setNotAuthorized(true);

                        setTimeout(() => {
                            setNoAccountDiv(false)
                        }, 2000);
                    }
                })

        }
    }, [username])

    const Loading = () => {        //the loading div
        let x = localStorage.getItem("accent") || 'grey'

        return <div className="d-flex justify-content-center mt-2">
            <Loader type="TailSpin"
                color={x}
                height={50}
                width={50}
            />

        </div>;
    };

    const NoFollowers = () => {
        return <div className="d-flex justify-content-center p-2">
            <span style={{ fontSize: "18px", fontWeight: 'bolder' }}>No one follows {username}, they seem nice though</span>
        </div>
    }

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

                        <div className="  row d-flex view" style={{ textAlign: 'center', fontWeight: '700' }}>
                            <div className={finalPath === '/followers' ? "w-50 follow-tab-active" : "w-50 follow-tab"}>
                                <div className="p-3 ">
                                    Followers
                                </div>
                            </div>
                            <Link to={`/u/${profile.username}/following`} className={finalPath === '/following' ? "w-50 follow-tab-active" : "w-50 follow-tab"}>
                                <div className="p-3 ">
                                    Following
                                    </div>
                            </Link>
                        </div>

                        {notFollowers ? <NoFollowers /> : null}
                        {loading && <Loading />}
                        {followers.data.map((item, i) => {
                            // setHoverData(item.User[0])
                            let icon = "https://avatars.dicebear.com/api/identicon/" + item.User[0].username + ".svg";
                            return <Link to={`/u/${item.User[0].username}`} className="p-2 view row main-post-div post-link name-link " key={i}>
                                <div className="col-1.5">              {/* <--- user avi */}
                                    <div
                                        to={`/u/${item.User[0].username}`}
                                    >
                                        <img src={icon} alt="example" className="user-logo" />
                                    </div>

                                </div>
                                <div className="col ">
                                    <div
                                        to={`/u/${item.User[0].username}`}
                                        style={{ fontWeight: '700', textDecoration: 'none' }}
                                        className="name-link "
                                    >
                                        {item.User[0].fullname}
                                    </div>
                                    <div>
                                        <span className="mb-5">@{item.User[0].username}</span>
                                    </div>
                                    <div>{item.User[0].bio}</div>
                                </div>
                            </Link>

                        })}

                    </div>

                    <Sidebar />
                </div>
            </div>

        </div>
    )
}
