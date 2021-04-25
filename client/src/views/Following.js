import React, { useState, useEffect } from 'react'
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useParams, useHistory, useLocation, Link } from 'react-router-dom'
import axios from 'axios'

export default function Following() {

    const [profile, setProfile] = useState([{ fullname: '', username: '', bio: '', followers: 0, following: 0, isfollowedbyme: false }])  //display user data

    let { user } = useParams()

    let { history } = useHistory()

    const internalError = () => {       //redirect when there is a server error
        return history.push("/Error");
    };

    useEffect(() => {
        axios.get(`/profile/user/${user}`)  //getting profile data for anyone
            .then((res) => {
                setProfile(res.data[0])
                // console.log(res.data)
                // let x = res.data[0]._id
                document.title = `People followed by @${user} - TwitClone`
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
    }, [user])

    let location = useLocation()
    let path = location.pathname
    let path1 = path.split(`/u/${profile.username}`)
    let finalPath = path1[1]

    let icon = "https://avatars.dicebear.com/api/identicon/" + user + ".svg";

    return (
        <div className="App general">
            <Navbar />
            <div className="container  " >
                <div className="row " >
                    <Header />

                    <div className="col main-view phone-home " >

                        <div className={window.scrollY > 0 ? "row profile-header " : "row profile-header-scroll "}>

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

                        <div className="row d-flex view" style={{ textAlign: 'center', fontWeight: '700' }}>
                            <div className={finalPath === '/followers' ? "w-50 follow-tab-active" : "w-50 follow-tab"}>
                                <Link to={`/u/${profile.username}/followers`} className="follow-tab">
                                    <p className="p-2 ">
                                        Followers
                                        </p>
                                </Link>
                            </div>
                            <div className={finalPath === '/following' ? "w-50 follow-tab-active" : "w-50 follow-tab"}>
                                <p className="p-2">Following</p>
                            </div>
                        </div>

                        <div className="p-2 view row main-post-div" >
                            <div className="col-1.5">              {/* <--- user avi */}
                                {/* <Link
                                    to={`/u/${profile.username}`}
                                    onMouseEnter={() => HoverDiv(item._id)}
                                    onMouseLeave={() => setHoverDiv(false)}
                                > */}
                                <img src={icon} alt="example" className="user-logo" />
                                {/* </Link> */}

                                {/* {hoverDiv[item._id] ? <HoverDiv /> : null} */}
                            </div>
                            <div className="col">
                                name
                                 <div>
                                    <span className="mb-5">@username</span>
                                </div>
                                <div>bio here</div>
                            </div>

                        </div>
                    </div>

                    <Sidebar />
                </div>
            </div>

        </div>
    )
}
