const express = require('express');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;
const bcrypt = require("bcrypt");
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.render('login');
})


module.exports = router;