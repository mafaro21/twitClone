const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const isLoggedin = require("../middleware/authchecker");
const { TweetValidation } = require("../middleware/inputvalidation");
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const uri = process.env.MONGO_URL;
const router = express.Router();

/** POST A COMMENT ON a TWEET */
router.post("/tweet/:tweetid", isLoggedin, TweetValidation, (req, res, next) => {
    const userid = req.session.user.id;
    const tweetid = req.params.tweetid;
    const { content } = req.body;

    if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

    /** Objectives:
   * 1. ADD NEW ENTRY to `comments` collection
   * 2. INCREMENT +1 `count` of _comments_ in the referenced `tweet`
   */

    const commentObject = {
        userid: new ObjectId(userid),
        tweetid: new ObjectId(tweetid),
        content: content,
        date: new Date()
    };

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const comments = client.db("twitclone").collection("comments");
            const tweets = client.db("twitclone").collection("tweets");
            try {
                const r1 = await comments.insertOne(commentObject);
                const r2 = await tweets.updateOne({ _id: commentObject.tweetid }, { $inc: { comments: 1 } });
                if (r1.result.ok && r2.result.ok)
                    res.status(201).send({ "success": true });
            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        }).catch(next);
});


/** DELETE A COMMENT @param commentid and @param userid */
router.delete("/:commentid/tweet/:tweetid", isLoggedin, (req, res, next) => {
    const userid = req.session.user.id;
    const commentid = req.params.commentid;
    const tweetid = req.params.tweetid;


    if (!ObjectId.isValid(commentid) || !ObjectId.isValid(tweetid))
        return res.sendStatus(400);

    // Objectives: Negate the above ones in the POST block.
    // Will Only DELETE if current (sesssion) User === this.comment.userid
    const commentObject = {
        _id: new ObjectId(commentid),
        userid: new ObjectId(userid),
        tweetid: new ObjectId(tweetid)
    };
    //query the DB,
    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const comments = client.db("twitclone").collection("comments");
            const tweets = client.db("twitclone").collection("tweets");
            try {
                let r1 = await comments.deleteOne(commentObject);
                if(r1.deletedCount === 0) throw new Error("Cannot delete comment!");
                await tweets.updateOne({ _id: commentObject.tweetid }, { $inc: { comments: -1 } });
                res.status(200).send({ "deleted": 1, "success": true });
            } catch (error) {
                res.sendStatus(400);
                console.error(error);
            } finally {
                await client.close();
            }
        }).catch(next);
});


/** GET ALL COMMENTS on TWEET */
router.get("/tweet/:tweetid", (req, res, next) => {
    const tweetid = req.params.tweetid;
    if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

    const agg = [
        {
            $match: {
                tweetid: new ObjectId(tweetid),
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userid",
                foreignField: "_id",
                as: "User",
            }
        },
        {
            $project: {
                _id: 1,
                date: 1,
                content: 1,
                "User.fullname": 1,
                "User.username": 1,
            }
        }
    ];

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const comments = client.db("twitclone").collection("comments");
            try {
                const result = await comments.aggregate(agg)
                    .sort({ date: -1 })
                    .limit(50)
                    .toArray();
                if (!result) throw new Error("No comments for this tweet");
                res.status(200).send(result);
            } catch (error) {
                res.status(404).send({ "message": error.message });
                console.error(error);
            } finally {
                await client.close();
            }
        }).catch(next);

});

/** ERROR handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error("COMMENT_ROUTE", err);
});


module.exports = router;