const express = require('express');
const isLoggedin = require('../middleware/authchecker');
const router = express.Router();

//HANDLING TWEETS

/* GET ALL TWEETS */
router.get("/", (req, res, next)=>{

});

//get single tweet
router.get("/:tweetid", (req, res, next)=>{
    
});

//POST TWEET
router.post("/", isLoggedin, (req, res, next)=>{
    
});

//DELETE SINGLE TWEET
router.delete("/:tweetid", isLoggedin, (req, res, next)=>{
    
});



module.exports = router;