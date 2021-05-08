const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URL;
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const router = express.Router();
const rateLimit = require("express-rate-limit"); // store it later in REDIS


//setup rate limit
const RetweetLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50, //==> 50 hits in 5 minute window.
    message: { "message": "Too many requests, try again in 5 mins" }
});



/* COUNT MY retweet on A TWEET => 1 or 0 */
router.get("/me/:tweetid", (req, res, next) => {
    const userid = req.session.user.id;
    const tweetid = req.params.tweetid;
    if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const retweets = client.db("twitclone").collection("retweets");
            const query = { tweetid: new ObjectId(tweetid), userid: new ObjectId(userid) };
            try {
                const myRetweet = await retweets.countDocuments(query);
                res.send({ "count": myRetweet });
            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        }).catch(next);

});


/** DO A RETWEET by `tweetid` ✅ */
router.post("/:tweetid", RetweetLimiter, (req, res, next) => {
    const userid = req.session.user.id; // user who is retweeting
    const tweetid = req.params.tweetid;
    if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

    /** Objectives:
   * 1. ADD NEW ENTRY to `retweets` collection
   * 2. INCREMENT +1 `count` of _retweets_ in the referenced `tweet`
   */

    const retweetObject = {
        OGtweetid: new ObjectId(tweetid),
        userid: new ObjectId(userid),
        date: new Date(),
    };

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const retweets = client.db("twitclone").collection("retweets");
            const tweets = client.db("twitclone").collection("tweets");
            try {
                const r1 = await retweets.insertOne(retweetObject);
                const r2 = await tweets.updateOne({ _id: retweetObject.OGtweetid }, { $inc: { retweets: 1 } });
                if (r1.result.ok && r2.result.ok)
                    res.status(201).send({ "success": true });
            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        }).catch(next);
});


/** UNDO ❌ RETWEET by tweetid */
router.delete("/:tweetid", RetweetLimiter, (req, res, next) => {
    const userid = req.session.user.id; // user who is retweeting
    const tweetid = req.params.tweetid;
    if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

    /** Objectives:
   * 1. REMOVE ENTRY from `retweets` collection
   * 2. DECREMENT -1 `count` of _retweets_ in the referenced `tweet`
   */

    const retweetObject = {
        OGtweetid: new ObjectId(tweetid),
        userid: new ObjectId(userid),
    };

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const retweets = client.db("twitclone").collection("retweets");
            const tweets = client.db("twitclone").collection("tweets");
            try {
                const r1 = await retweets.deleteOne(retweetObject);
                const r2 = await tweets.updateOne({ _id: retweetObject.OGtweetid }, { $inc: { retweets: -1 } });
                if (r1.deletedCount === 1 && r2.modifiedCount === 1)
                    res.status(200).send({ "success": true });
            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        }).catch(next);
});


/** error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error("RETWEET_Error", err);
});

module.exports = router;