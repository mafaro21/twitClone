import React, { useState, useEffect } from 'react';
import '../css/Sidebar.css';
import '../css/custom.scss';
import axios from "axios";

function Sidebar() {

    const [confirmed, setConfirmed] = useState();
    const [location, setLocation] = useState();
    const [deaths, setDeaths] = useState();
    const [recovered, setRecovered] = useState();

    // const corona = useEffect(() => {

    //     // getData();

    //     const options = {
    //         method: 'GET',
    //         url: 'https://newsapi.org/v2/top-headlines',
    //         params: {
    //             category: 'general',
    //             pageSize: 4,
    //             country: 'us',
    //             apiKey: process.env.REACT_APP_NEWS_API_KEY
    //         }

    //     };

    //     axios.request(options).then(function (res) {
    //         // localStorage.setItem('confirmed', res.data.data.confirmed);
    //         // localStorage.setItem('deaths', res.data.data.deaths);
    //         // localStorage.setItem('location', res.data.data.location);
    //         // localStorage.setItem('recovered', res.data.data.recovered);
    //         // getData();
    //         console.log(res.data);
    //     }).catch(function (error) {
    //         console.error(error);
    //     });

    //     // function getData() {
    //     //     setConfirmed(localStorage.getItem('confirmed'));
    //     //     setDeaths(localStorage.getItem('deaths'));
    //     //     setLocation(localStorage.getItem('location'));
    //     //     setRecovered(localStorage.getItem('recovered'));
    //     // }

    // }, [])

    return (
        <div className="col-sm-4 p-3 phone-sidebar" >
            <div className="p-3 sidebar">
                <h5>Trending Topics</h5>
                <p>dfdsafdsafd</p>
            </div>
            <div className="p-3 mt-4 sidebar">
                <h5 className="view">Coronavirus Stats in {location}</h5>
                <p>Confirmed: {confirmed}</p>
                <p>Recovered: {recovered}</p>
                <p>Deaths: {deaths}</p>
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