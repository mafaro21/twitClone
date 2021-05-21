import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Search from '../components/Search'
// import unf2 from '../images/unf2.jpg';
import axios from "axios";
import Loader from "react-loader-spinner";

export default function Explore() {
    const [apiData, setApiData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.title = "TwitClone - Explore"

        const options = {
            method: 'GET',
            url: 'https://newsapi.org/v2/top-headlines',
            params: {
                category: 'general',
                pageSize: 1,
                country: 'us',
                apiKey: process.env.REACT_APP_NEWS_API_KEY
            }
        };

        axios.request(options).then(function (res) {
            // console.log(res.data.articles[0])
            setApiData(res.data.articles[0])
            setLoading(false);
        }).catch(function (error) {
            console.error(error);
        });
    }, [])

    const Loading = () => {        //the loading div
        let x = localStorage.getItem("accent") || 'grey'

        return <div className="d-flex justify-content-center">
            <Loader type="TailSpin"
                color={x}
                height={40}
                width={40}
            />

        </div>
    }


    return (
        <div className="App general ">
            <div className="container ">

                <div className="row ">

                    <Header />
                    <div className="col main-view phone-home ">
                        <div className="row view p-3" >
                            <div style={{ width: '100%' }}>
                                <Search />
                            </div>
                        </div>

                        {loading ? <Loading /> :
                            <div className=" banner row modal-enter" >
                                <img src={apiData.urlToImage} alt="explore" className="explore-photo " />
                                <p className="explore-data col">{apiData.title}</p>
                            </div>
                        }



                    </div>

                    <Sidebar />
                </div>
            </div>
        </div>

    )
}
