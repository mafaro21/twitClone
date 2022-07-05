import React, { useState, useEffect } from 'react'
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';

export default function NoAccount({ currentState }) {

    const [noAccState, setNoAccState] = useState(currentState)

    useEffect(() => {
        setNoAccState(currentState)

    }, [currentState, setNoAccState])


    return (
        <div style={{ zIndex: '10' }}>
            <div>
                <div className="no-acc-wrapper" >
                    <div className={noAccState ? "no-acc-test modal-enter" : "no-acc-test no-acc-modal-leave"} >
                        <div className="">
                            <div className="no-acc-view">


                                <div className="modal-body row p-3 d-flex justify-content-center">

                                    <div className="p-3" style={{ fontWeight: 700 }}>
                                        You need to be logged in to do that!!!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    )
}


