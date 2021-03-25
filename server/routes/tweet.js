const express = require('express');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;
const isLoggedin = require('../middleware/authchecker');
const router = express.Router();

//HANDLING TWEETS

/* GET ALL TWEETS */
router.get("/", (req, res, next) => {

});

//get single tweet
router.get("/:tweetid", (req, res, next) => {

});

//POST TWEET
router.post("/", isLoggedin, (req, res, next) => {
    const userid = req.session.user.id;
    const { content } = req.body;
    let errors = []; // input errors

    //-----------START VALIDATION------------//
    function checkInputs() {
        let OK = true;
        const reg = /^[^><]+$/gi;

        if (!content || content.length < 0) {
            return false;
        }
        if (!reg.test(content)) {
            errors.push("Tweet contains invalid characters");
            OK = false;
        }
        if (content.length > 280) {
            errors.push("Max length of tweet exceeded");
            OK = false;
        }
        return OK;
    }

    const checkInputsResult = checkInputs();
    if (checkInputsResult === false) {
        res.status(422).send({ "message": errors, "success": false });
        return;
    } else postTweetToDatabase();

    //-----------END OF VALIDATION ABOVE------------//

    function postTweetToDatabase() {
        const tweetObject = {
            byUserId: userid,
            content: content,
            likes: 0,
            comments: 0,
            dateposted: new Date()
        };

        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then(async (client) => {
            const tweets = client.db("twitclone").collection("tweets");
            try {
                const result = await tweets.insertOne(tweetObject);
                res.status(201).send({ "tweeted": result.insertedCount, "success": true })
            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        }).catch(next);
    }
});

//DELETE SINGLE TWEET
router.delete("/:tweetid", isLoggedin, (req, res, next) => {

});


/*error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error("TWEET_Error ", err);
});


module.exports = router;