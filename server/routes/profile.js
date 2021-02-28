const express = require("express");
const isLoggedin = require("../middleware/authchecker");
const router = express.Router();

//FOR PROFILE //

/* GETTING MY PROFILE */
router.get("/mine", isLoggedin, (req, res, next) => {
    res.send("<p>Hello there, this is your profile</p>");
});

/*  GETTING OTHER PEOPLEL */ 
router.get("/user/:userid", (req, res, next) => {
    let userid = req.params.userid;
    res.send(`Profile belongs to  ${userid}`);
});

/* handling PUT/(UPDATE PROFILE) requests */
router.put("/mine", isLoggedin, (req, res, next) => {

});

/*error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error(err.message);
});

module.exports = router;