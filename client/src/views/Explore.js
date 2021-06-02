import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Search from '../components/Search'
// import unf2 from '../images/unf2.jpg';
import Loader from "react-loader-spinner";
import axios from "axios";


export default function Explore() {

    const [mainApiData, setMainApiData] = useState({})
    const [apiData, setApiData] = useState({ articles: [0] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        document.title = "TwitClone - Explore"


        const options = {
            method: 'GET',
            url: 'https://newsapi.org/v2/top-headlines',
            params: {
                category: 'science',
                pageSize: 3,
                country: 'us',
                apiKey: process.env.REACT_APP_NEWS_API_KEY
            }
        };

        axios.request(options).then(function (res) {
            setMainApiData(res.data.articles[2])
            setApiData(res.data)
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
                            <>
                                <a href={mainApiData.url} target="_blank" className=" banner row modal-enter" style={{ textDecoration: 'none' }}>
                                    <img src={mainApiData.urlToImage} alt="explore" className="explore-photo " />
                                    <p className="explore-data col ">{mainApiData.title}</p>
                                </a>
                                {apiData.articles.map((item, key) => (
                                    <>
                                        <div className="row view p-2 modal-enter" key={key}>
                                            <div className="col">
                                                <a href={item.url} style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" className="row ">
                                                    <img src={item.urlToImage} className="col-4 api-image row mt-1" alt="news" />
                                                    <p className="col api-text " >{item.title} </p>
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </>
                        }

                    </div>

                    <Sidebar />
                </div>
            </div>
        </div>

    )
}
