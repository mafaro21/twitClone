import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Search from '../components/Search';
import axios from "axios";
import Loader from "react-loader-spinner";
import { Link, useHistory, useLocation } from 'react-router-dom';

export default function SearchResults() {
    let location = useLocation();
    let history = useHistory();

    const [searchData, setSearchData] = useState({ data: [] });
    const [searchParams, setSearchParams] = useState('');
    const [searchError, setSearchError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchErr, setSearchErr] = useState({});
    const [error, setError] = useState([]);     //using array, data comes that way
    const errorDiv = error
        ? <div>
            {error}
        </div>
        : '';

    let path0 = location.search;
    let path5 = path0.split('?q=');
    let searchResult = path5[1];

    const SearchValidation = (query) => {    //front-end regex
        const searchErr = {};
        let reg = /[^A-Za-z0-9_]/g;

        let isValid = true;

        if (query.trim().length < 4) {
            searchErr.short = 'Search query is way too short';
            isValid = false;
        }
        if (reg.test(query)) {
            searchErr.invalid = 'Search query contains illegal characters';
            isValid = false;
        }
        if (query.match(/\s/)) {
            searchErr.invalid = "No spaces allowed in query";
            isValid = false;
        }


        setSearchErr(searchErr);

        return isValid;
    };

    useEffect(() => {

        const isValid = SearchValidation(searchResult);

        if (isValid === true) {
            setSearchError(false);
            setError(false);
            setLoading(true);
            setSearchParams(searchResult);

            axios.get(`/extras/search?user=${searchResult}`)
                .then((res) => {
                    setSearchData(res)
                })
                .catch((err) => {
                    err.response.status === 404 ? setSearchError(true) : setError(err.response.data.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        let x = location.pathname
        let y = location.search
        let z = x + y       //length of the url

        if (z.length < 14) {
            history.push('/explore');
        }
    }, [searchResult]);

    const Loading = () => {        //the loading div
        let x = localStorage.getItem("accent") || 'grey';

        return <div className="d-flex justify-content-center mt-2">
            <Loader type="TailSpin"
                color={x}
                height={40}
                width={40}
            />

        </div>;
    };

    const SearchDoesntExist = () => {
        return <div className="d-flex justify-content-center p-2">

            <span style={{ fontSize: "18px", fontWeight: 700 }}>
                {searchParams} doesn't exist, maybe try a different user?
                </span>

        </div>;
    };

    return (
        <div className="App general ">
            <div className="container ">

                <div className="row ">

                    <Header />
                    <div className="col main-view phone-home ">
                        <div className="row view p-3" >
                            <div style={{ width: '100%' }}>
                                <Search />
                                {Object.keys(searchErr).map((key) => {
                                    return <div style={{ color: "red" }} className="mt-2 error-msg d-flex justify-content-center"> {searchErr[key]} </div>;
                                })}
                                <div style={{ color: "red" }} className="error-msg ">{errorDiv}</div>

                            </div>

                            {searchData ?
                                <div className="mt-2" style={{ fontWeight: '700', fontSize: '25px' }}>
                                    Search Results for '{searchParams}' :
                                </div>
                                : null
                            }

                        </div>

                        {loading ? <Loading /> : null}
                        {searchError ? <SearchDoesntExist /> : null}
                        {searchData.data.map((item, key) => {
                            let icon = "https://avatars.dicebear.com/api/gridy/" + item.username + ".svg";
                            return <div className="p-2 view row main-post-div modal-enter" key={key}>
                                <div className="col-1.5">              {/* <--- user avi */}
                                    <Link
                                        to={`/u/${item.username}`}
                                    >
                                        <img src={icon} alt="example" className="user-logo" />
                                    </Link>

                                </div>

                                <Link to={`/u/${item.username}`} className="col user-name-tweet post-div" >
                                    <div  >
                                        <div >
                                            <Link
                                                to={`/u/${item.username}`}
                                                className="name-link"
                                            >
                                                <strong >{item.fullname}</strong>&nbsp;
                                            </Link>
                                            <div><span>@{item.username}</span></div>
                                        </div>
                                    </div>
                                </Link>
                            </div>;
                        })}

                    </div>

                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
