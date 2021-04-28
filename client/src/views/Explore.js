import React from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Search from '../components/Search'

export default function Explore() {
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
yep

                    </div>

                    <Sidebar />
                </div>
            </div>
        </div>

    )
}
