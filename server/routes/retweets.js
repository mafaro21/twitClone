const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URL;
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const router = express.Router();
const rateLimit = require("express-rate-limit"); // store it later in REDIS


//setup rate limit
const RetweetLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30, //==> 50 hits in 5 minute window.
    message: { "message": "Too many requests, try again later" }
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
                if (r1.insertedCount === 1) {
                    await tweets.updateOne({ _id: retweetObject.OGtweetid }, { $inc: { retweets: 1 } });
                    res.status(201).send({ "success": true });
                }
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
                let r1 = await retweets.deleteOne(retweetObject);
                if (r1.deletedCount === 0) throw new Error("Cannot undo retweet");
                await tweets.updateOne({ _id: retweetObject.OGtweetid }, { $inc: { retweets: -1 } });
                res.status(200).send({ "success": true });
            } catch (error) {
                res.status(400).send({ message: error.message });
            } finally {
                await client.close();
            }
        }).catch(next);
});

/** FETCH ALL RETWEETS BY USER */
router.get("/:userid", (req, res, next) => {
    const byUserId = req.params.userid;
    if (!ObjectId.isValid(byUserId)) return res.sendStatus(400);

    const agg = [
        {
            $match: {
                userid: new ObjectId(byUserId)
            }
        }, {
            $sort: { _id: -1 }
        },
        {
            $limit: 20
        },
        {
            $lookup: {
                from: "tweets",
                localField: "OGtweetid",
                foreignField: "_id",
                as: "ogtweet"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "ogtweet.byUserId",
                foreignField: "_id",
                as: "oguser"
            }
        },
        {
            $project: {
                _id: 1,
                ogtweet: 1,
                "oguser.fullname": 1,
                "oguser.username": 1,
            }
        }
    ];

    //collect all retweets from db
    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            try {
                const retweets = client.db("twitclone").collection("retweets");
                const result = await retweets.aggregate(agg).toArray();
                if (result.length === 0) throw new Error("No retweets by this user");
                res.status(200).send(result);
            } catch (error) {
                res.sendStatus(404);
            }
        }).catch(next);

});



/** error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error("RETWEET_Error", err);
});

module.exports = router;