import axios from 'axios';
import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';


function Search() {
    let history = useHistory();

    const [search, setSearch] = useState('')
    const [searchErr, setSearchErr] = useState({})
    const [errorColor, setErrorColor] = useState(false)

    // const Destination = () => {
    //     // history.push("/Explore")
    //     return history.push("/signup")
    //     // <Redirect to="/Explore" />
    // }

    // console.log(history)

    const handleSearch = (e) => {
        e.preventDefault()

        setSearchErr({})

        const isValid = SearchValidation()

        if (isValid === true) {
            // searchData('yep')
            return history.push(`/search?q=${search}`)
            // return <Redirect to="explore" />

            // axios.get(`/extras/search?user=${search}`)
            //     .then((res) => {
            //         // console.log(res.data)
            //         // Destination()
            //         return history.push("/more")
            //     })
            //     .catch((err) => {
            //         console.error(err)
            //     })
        } else setErrorColor(true);
    }

    const SearchValidation = () => {    //front-end regex
        const searchErr = {}
        let reg = /[^A-Za-z0-9_\S]+/g;

        let isValid = true

        if (search.trim().length < 4) {
            searchErr.short = 'Search query is way too short'
            isValid = false
        }
        if (search.match(reg)) {
            searchErr.invalid = 'Search query contains illegal characters'
            isValid = false
        }

        setSearchErr(searchErr)

        return isValid
    }

    return (
        <>

            <form className="d-flex " onSubmit={(e) => handleSearch(e)}>

                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search search-logo" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                <input
                    className={errorColor ? "search-error " : "search-input "}
                    type="search"
                    placeholder="Search TwitClone Users..."
                    maxLength='15'
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />

            </form>
            {Object.keys(searchErr).map((key) => {
                return <div style={{ color: "red" }} className="mt-2 error-msg d-flex justify-content-center"> {searchErr[key]} </div>
            })}
        </>
    );

}

export default Search;


