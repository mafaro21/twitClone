import React, { useState, useEffect } from 'react'


export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark" ? true : false);
    useEffect(() => {
        // localStorage.setItem("theme", "dark");
        // localStorage.setItem("accent", "orange");

        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", localStorage.getItem("theme"), "accent-theme", localStorage.getItem("accent"));
        // document.setAttribute("accent-theme", localStorage.getItem("accent"));

        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("accent-theme", localStorage.getItem("accent"));

    }, []);

    const toggleThemeChange = () => {
        if (isDark === false) {
            localStorage.setItem("theme", "dark");
            document
                .getElementsByTagName("HTML")[0]
                .setAttribute("data-theme", localStorage.getItem("theme"));
            setIsDark(true);
        } else {
            localStorage.setItem("theme", "light");
            document
                .getElementsByTagName("HTML")[0]
                .setAttribute("data-theme", localStorage.getItem("theme"));
            setIsDark(false);
        }
    }

    const darkMode = () => {
        localStorage.setItem("theme", "dark");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", localStorage.getItem("theme"));
    }

    const lightMode = () => {
        localStorage.setItem("theme", "light");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", localStorage.getItem("theme"));
    }

    const mediumMode = () => {
        localStorage.setItem("theme", "medium");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", localStorage.getItem("theme"));
    }

    const orangeAccent = () => {
        localStorage.setItem("accent", "orange");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("accent-theme", localStorage.getItem("accent"));
    }

    const redAccent = () => {
        localStorage.setItem("accent", "red");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("accent-theme", localStorage.getItem("accent"));
    }

    const skyBlueAccent = () => {
        localStorage.setItem("accent", "sky-blue");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("accent-theme", localStorage.getItem("accent"));
    }

    const greenAccent = () => {
        localStorage.setItem("accent", "green");
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("accent-theme", localStorage.getItem("accent"));
    }


    return (
        <div className="mt-3">
            {/* <input type="checkbox" className="toggle" onClick={toggleThemeChange} /> */}
THEMES
            <div>
                <button className="text" onClick={lightMode}>light</button>
            </div>

            <div>
                <button className="text" onClick={darkMode}>dark</button>
            </div>

            <div>
                <button className="text" onClick={mediumMode}>medium???</button>
            </div>

            <div className="mt-3">ACCENTS</div>
            <div>
                <button className="text" onClick={orangeAccent}>orange</button>
            </div>
            <div>
                <button className="text" onClick={redAccent}>red</button>
            </div>
            <div>
                <button className="text" onClick={skyBlueAccent}>sky-blue</button>
            </div>
            <div>
                <button className="text" onClick={greenAccent}>green</button>
            </div>

        </div>
    )
}
