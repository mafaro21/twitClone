import React, { useEffect, useContext } from 'react'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import ThemeToggle from '../components/ThemeToggle'
import axios from 'axios';
import OffCanvas from '../components/OffCanvas';
import BottomRow from '../components/BottomRow'


export default function More() {

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'TwitClone - More'

        axios.get('https://jsonplaceholder.typicode.com/posts/1')
            .then((res) => {
                console.log(res)
            })

    }, [])



    return (
        <div className="App general ">
            <div className="container ">
                <div className="row ">

                    <Header />

                    <div className="col main-view phone-home ">
                        <div className="row profile-header view">

                            <div className="p-2  col row " id="top">
                                <div className="ml-3 col-1.5">
                                    <BackButton />
                                </div>
                                <div className="col ">
                                    <div className="p-1">
                                        <strong>More</strong>
                                    </div>
                                </div>
                                <OffCanvas />

                            </div>


                        </div>

                        <div className="p-2 view row d-flex justify-content-center">
                            <ThemeToggle />

                        </div>

                    </div>

                    <Sidebar />
                </div>
            </div>
            <BottomRow />
        </div>

    )
}
