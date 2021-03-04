import React from 'react';
import axios from 'axios';

export default function IsLoggedIn() {


    return axios.get("/statuslogin")
        .then((res) => {
            return res.data.loggedin;
        })
        .catch((err) => {
            throw err;
        })



}