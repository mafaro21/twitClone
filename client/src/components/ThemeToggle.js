import React, { useState, useEffect, useContext } from 'react'
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/custom.scss';
import '../css/Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faCircle } from '@fortawesome/free-regular-svg-icons/faCircle';




export default function ThemeToggle() {
    const [theme, setTheme] = useState(localStorage.getItem("theme"))
    const [accent, setAccent] = useState(localStorage.getItem("accent"))

    // useEffect(() => {

    //     document
    //         .getElementsByTagName("HTML")[0]
    //         .setAttribute("data-theme", localStorage.getItem("theme"), "accent-theme", localStorage.getItem("accent"));
    //     // document.setAttribute("accent-theme", localStorage.getItem("accent"));

    //     document
    //         .getElementsByTagName("HTML")[0]
    //         .setAttribute("accent-theme", localStorage.getItem("accent"));

    // }, []);



    const darkMode = () => {
        localStorage.setItem("theme", "dark");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", localStorage.getItem("theme"));
        setTheme("dark")
    }

    const lightMode = () => {
        localStorage.setItem("theme", "light");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", localStorage.getItem("theme"));
        setTheme("light")
    }

    const mediumMode = () => {
        localStorage.setItem("theme", "medium");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", localStorage.getItem("theme"));
        setTheme("medium")

    }

    const orangeAccent = () => {
        localStorage.setItem("accent", "rgb(244, 93, 34)");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("accent-theme", localStorage.getItem("accent"));
        setAccent("rgb(244, 93, 34)")
    }

    const redAccent = () => {
        localStorage.setItem("accent", "rgb(224, 36, 94)");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("accent-theme", localStorage.getItem("accent"));
        setAccent("rgb(224, 36, 94)")
    }

    const skyBlueAccent = () => {
        localStorage.setItem("accent", "rgba(29,161,242,1.00)");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("accent-theme", localStorage.getItem("accent"));
        setAccent("rgba(29,161,242,1.00)")
    }

    const greenAccent = () => {
        localStorage.setItem("accent", 'rgb(23, 191, 99)');
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("accent-theme", localStorage.getItem("accent"));
        setAccent("rgb(23, 191, 99)")
    }


    return (

        <div className="mt-3" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 700 }} className="">
                Customize Your View
            </div>

            <div style={{ fontWeight: 700 }} className="mt-3">Background</div>
            <div className="mt-1 theme">
                {/* {x === light ? } */}
                <div
                    className={theme === 'light' ? "more-back-active m-2 more-light" : "more-back m-2 more-light"}
                    onClick={lightMode}
                >
                    {theme === 'light' ? <FontAwesomeIcon icon={faCheckCircle} size="lg" className="mt-2" /> : <FontAwesomeIcon icon={faCircle} size="lg" className="mt-2" />}
                    <button className="text p-3 more-light" >light</button>
                </div>

                <div
                    className={theme === 'dark' ? "more-back-active m-2 more-dark" : "more-back m-2 more-dark"}
                    onClick={darkMode}
                >
                    {theme === 'dark' ? <FontAwesomeIcon icon={faCheckCircle} size="lg" className="mt-2" /> : <FontAwesomeIcon icon={faCircle} size="lg" className="mt-2" />}
                    <button className="text p-3 more-dark" >dark</button>
                </div>

                <div
                    className={theme === 'medium' ? "more-back-active m-2 more-medium" : "more-back m-2 more-medium"}
                    onClick={mediumMode}
                >
                    {theme === 'medium' ? <FontAwesomeIcon icon={faCheckCircle} size="lg" className="mt-2" /> : <FontAwesomeIcon icon={faCircle} size="lg" className="mt-2" />}
                    <button className="text p-3 more-medium" >medium</button>
                </div>
            </div>

            <div style={{ fontWeight: 700 }} className="mt-5">Theme Color</div>

            <div className="mt-3 d-flex flex-row justify-content-between">
                <div title="orange" className="more-accent m-2 orange-accent" onClick={orangeAccent}>
                    {accent === "rgb(244, 93, 34)" ? <FontAwesomeIcon icon={faCheck} size="lg" className="mt-2" /> : null}
                </div>
                <div title="red" className="more-accent m-2 red-accent" onClick={redAccent}>
                    {accent === "rgb(224, 36, 94)" ? <FontAwesomeIcon icon={faCheck} size="lg" className="mt-2" /> : null}
                </div>
                <div title="skyblue" className="more-accent m-2 blue-accent" onClick={skyBlueAccent}>
                    {accent === "rgba(29,161,242,1.00)" ? <FontAwesomeIcon icon={faCheck} size="lg" className="mt-2" /> : null}
                </div>
                <div title="green" className="more-accent m-2 green-accent" onClick={greenAccent}>
                    {accent === "rgb(23, 191, 99)" ? <FontAwesomeIcon icon={faCheck} size="lg" className="mt-2" /> : null}
                </div>
            </div>

        </div>


    )
}
