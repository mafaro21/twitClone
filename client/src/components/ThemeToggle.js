import React, { useState, useEffect } from 'react'


export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark" ? true : false);
    useEffect(() => {
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", localStorage.getItem("theme"));
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

    return (
        <div>
            <input type="checkbox" className="toggle" onClick={toggleThemeChange} />

        </div>
    )
}
