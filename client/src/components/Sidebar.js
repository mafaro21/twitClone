import React, { useState, useEffect } from 'react';
import '../css/Sidebar.css';
import '../css/custom.scss';
import axios from "axios";

function Sidebar() {

    const [confirmed, setConfirmed] = useState();
    const [location, setLocation] = useState();
    const [deaths, setDeaths] = useState();
    const [recovered, setRecovered] = useState();

    useEffect(() => {

        getData();

        const options = {
            method: 'GET',
            url: 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total',
            params: { country: 'USA' },
            headers: {
                'x-rapidapi-key': '34cf492dbamshf4c3cf2197f8267p138e57jsn2e008248382d',
                'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (res) {
            localStorage.setItem('confirmed', res.data.data.confirmed);
            localStorage.setItem('deaths', res.data.data.deaths);
            localStorage.setItem('location', res.data.data.location);
            localStorage.setItem('recovered', res.data.data.recovered);
        }).catch(function (error) {
            console.error(error);
        });

        function getData() {
            setConfirmed(localStorage.getItem('confirmed'));
            setDeaths(localStorage.getItem('deaths'));
            setLocation(localStorage.getItem('location'));
            setRecovered(localStorage.getItem('recovered'));
        }

    }, [])

    return (
        <div className="col-sm-4 p-3 phone-sidebar">
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