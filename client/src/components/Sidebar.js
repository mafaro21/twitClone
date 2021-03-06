import React, { useState, useEffect } from 'react';
import '../css/Sidebar.css';
import '../css/custom.scss';
import axios from "axios";
import Loader from "react-loader-spinner";


function Sidebar() {

    const [api, setApi] = useState({ articles: [] });

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        const options = {
            method: 'GET',
            url: 'https://newsapi.org/v2/top-headlines',
            params: {
                category: 'general',
                pageSize: 5,
                country: 'us',
                apiKey: process.env.REACT_APP_NEWS_API_KEY
            }

        };

        axios.request(options).then(function (res) {
            setApi(res.data)
            setLoading(false);
        }).catch(function (error) {
            console.error(error);
        });



    }, [])

    const Loading = () => {        //the loading div

        return <div>
            <Loader type="TailSpin"
                color="orange"
                height={40}
                width={40}
            />

        </div>
    }

    return (
        <div className="col-sm-4 p-3 phone-sidebar" >
            <div className="p-3 sidebar">
                <h5>Trending Topics</h5>
                <p>dfdsafdsafd</p>
            </div>
            <div className="p-1 mt-4 sidebar">
                <h5 className="view p-3">Top Headlines</h5>
                <ul className="col">
                    {loading ? <Loading /> : null}
                    {api.articles.map(item => (
                        <li key={item.url} >
                            <a href={item.url} target="_blank" className="row view">
                                <img src={item.urlToImage} className="col-5 api-image row " />
                                <p className="col api-text">{item.title} </p>
                            </a>

                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-3 mt-4 sticky ">
                <div className="footer row">
                    <div className="col">
                        <p>About</p>
                        <p>Terms Of Service</p>
                    </div>
                    <div className="col">
                        <p>© TwitClone 2021</p>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Sidebar;