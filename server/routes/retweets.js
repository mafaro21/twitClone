const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URL;
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const router = express.Router();

/** DO A RETWEET by `tweetid` */
router.post("/:tweetid", (req, res, next) => {
    const userid = req.session.user.id; // user who is retweeting
    const tweetid = req.params.tweetid;
    if (!ObjectId.isValid(OGtweetid)) return res.sendStatus(400);

    /** Objectives:
   * 1. ADD NEW ENTRY to `retweets` collection
   * 2. INCREMENT +1 `count` of _retweets_ in the referenced `tweet`
   */

    const retweetObject = {
        OGtweetid: new ObjectId(tweetid),
        retweetby: new ObjectId(userid),
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

/** UNDO a RETWEET by tweetid */
router.delete("/:tweetid", (req, res, next) => {
    const userid = req.session.user.id; // user who is retweeting
    const tweetid = req.params.tweetid;
    if (!ObjectId.isValid(OGtweetid)) return res.sendStatus(400);

    /** Objectives:
   * 1. REMOVE ENTRY from `retweets` collection
   * 2. DECREMENT -1 `count` of _retweets_ in the referenced `tweet`
   */

    const retweetObject = {
        OGtweetid: new ObjectId(tweetid),
        retweetby: new ObjectId(userid),
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