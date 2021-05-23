const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URL;
const isLoggedin = require("../middleware/authchecker");
const { TweetValidation } = require("../middleware/inputvalidation");
const router = express.Router();
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };

//HANDLING TWEETS


/** GET ALL TWEETS! */
router.get("/", (req, res, next) => {
    const viewerId = getSafe(() => req.session.user.id, 0);  //current viewer (if Loggedin)
    const lastTweetID = req.query.lt;  //attached from Client for paging
    const mama = lastTweetID ? { $lt: new ObjectId(lastTweetID) } : { $gt: new ObjectId(0) };
    if (lastTweetID && !(ObjectId.isValid(lastTweetID))) {
        return res.sendStatus(400);
    }

    const agg = [
        {
            $match: {
                _id: mama
            }
        },
        {
            $sort: { _id: -1 }
        },
        {
            $limit: 30
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweetid",
                as: "likedby"
            }
        },
        {
            $lookup: {
                from: "retweets",
                localField: "_id",
                foreignField: "OGtweetid",
                as: "retweetby"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "byUserId",
                foreignField: "_id",
                as: "User"
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                likes: 1,
                retweets: 1,
                comments: 1,
                dateposted: 1,
                "User.fullname": 1,
                "User.username": 1,
                isLikedbyme: {
                    $in: [new ObjectId(viewerId), "$likedby.userid"]
                },
                isRetweetbyme: {
                    $in: [new ObjectId(viewerId), "$retweetby.userid"]
                }
            }
        }
    ];

    //retrieve data from db
    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const tweets = client.db("twitclone").collection("tweets");
            try {
                const result = await tweets.aggregate(agg).toArray();
                if (result.length === 0) throw new Error("No tweets");
                res.status(200).send(result);
            } catch (error) {
                if (error.message === 'No tweets') return res.sendStatus(404);
                throw error;
            } finally {
                await client.close();
            }
        }).catch(next);

    //this is to avoid UNDEFINED Error for viewerId
    function getSafe(fn, defaultValue) {
        try {
            return fn();
        } catch (e) {
            return defaultValue;
        }
    }
});


/** GET ALL TWEETS FROM given USER */
router.get("/user/:userid", (req, res, next) => {
    const userid = req.params.userid;
    const viewerId = getSafe(() => req.session.user.id, 0);  //current viewer (if Loggedin)
    const lastTweetID = req.query.lt || 0;  //attached by Client for paging
    //axios.get(tweets/user/{userID}?lt=x12345)
    if (!ObjectId.isValid(lastTweetID)) return res.sendStatus(400);
    const agg = [
        {
            $match: {
                byUserId: new ObjectId(userid),
                _id: { $gt: new ObjectId(lastTweetID) }
            }
        }, {
            $sort: { _id: -1 }
        },
        {
            $limit: 20
        }, {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweetid",
                as: "likedby"
            }
        }, {
            $lookup: {
                from: "retweets",
                localField: "_id",
                foreignField: "OGtweetid",
                as: "retweetby"
            }
        }, {
            $project: {
                _id: 1,
                content: 1,
                likes: 1,
                retweets: 1,
                comments: 1,
                dateposted: 1,
                isLikedbyme: {
                    $in: [new ObjectId(viewerId), "$likedby.userid"]
                },
                isRetweetbyme: {
                    $in: [new ObjectId(viewerId), "$retweetby.userid"]
                }
            }
        }
    ];

    //this is to avoid UNDEFINED Error for viewerId
    function getSafe(fn, defaultValue) {
        try {
            return fn();
        } catch (e) {
            return defaultValue;
        }
    }

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const tweets = client.db("twitclone").collection("tweets");
            try {
                const result = await tweets.aggregate(agg).toArray();
                if (result.length === 0) throw new Error("No tweets");
                res.status(200).send(result);
            } catch (error) {
                res.sendStatus(404);
                console.error("FetchTweetsErr", error);
            } finally {
                await client.close();
            }
        }).catch(next);
});

/** GET SINGLE TWEET! */
router.get("/:tweetid", (req, res, next) => {
    const tweetid = req.params.tweetid;
    if (!ObjectId.isValid(tweetid)) return res.sendStatus(404);
    //ABOVE^: verifying if tweetID is valid ObjectId.
    const agg = [
        {
            $match: {
                _id: new ObjectId(tweetid),
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "byUserId",
                foreignField: "_id",
                as: "User"
            }
        },
        {
            $project: {
                "User._id": 0,
                "User.email": 0,
                "User.bio": 0,
                "User.password": 0,
                "User.datejoined": 0,
                "User.followers": 0,
                "User.following": 0,
            }
        }
    ];
    //connect to DB
    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const tweets = client.db("twitclone").collection("tweets");
            try {
                const result = await tweets.aggregate(agg).toArray();
                if (result.length === 0) throw new Error("Tweet Not found");
                res.send(result);
            } catch (error) {
                res.status(404).send({ "message": error.message });
            } finally {
                await client.close();
            }
        }).catch(next);
});


/* GET ALL MY own TWEETS */
router.get("/mine/all", isLoggedin, (req, res, next) => {
    const userid = req.session.user.id;
    const lastTweetID = req.query.lt || 0; //attached with the consecutive requests
    //axios.get(mine/all?lt=x12345)
    if (!ObjectId.isValid(lastTweetID)) return res.sendStatus(404);

    const agg = [
        {
            $match: {
                byUserId: new ObjectId(userid),
                _id: { $gt: new ObjectId(lastTweetID) }
            }
        }, {
            $limit: 20
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweetid",
                as: "likedby"
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                likes: 1,
                comments: 1,
                dateposted: 1,
                isLikedbyMe: {
                    $in: ["$_id", "$likedby.tweetid"]
                }
            }
        }
    ];

    //retrieve data from db
    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const tweets = client.db("twitclone").collection("tweets");
            try {
                const result = await tweets.aggregate(agg)
                    .sort({ dateposted: -1, byUserId: -1 })
                    .toArray();
                if (result.length === 0) throw new Error("No tweets");
                res.status(200).send(result);
            } catch (error) {
                res.sendStatus(404);
                console.error("FETCHmyTWEETS", error);
            } finally {
                await client.close();
            }
        }).catch(next);
});

/* POST A NEW TWEET */
router.post("/", isLoggedin, TweetValidation, (req, res, next) => {
    const userid = req.session.user.id;
    const { content } = req.body;
    const tweetObject = {
        byUserId: new ObjectId(userid),
        content: content,
        likes: 0,
        comments: 0,
        retweets: 0,
        dateposted: new Date(),
    };

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const tweets = client.db("twitclone").collection("tweets");
            try {
                await tweets.insertOne(tweetObject);
                res.status(201).send({ "success": true });
            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        }).catch(next);
});

/* DELETE SINGLE TWEET */
router.delete("/:tweetid", isLoggedin, (req, res, next) => {
    const tweetid = req.params.tweetid;
    const userid = req.session.user.id;
    if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);
    //ABOVE^: verifying if tweetID is valid ObjectId.

    /**
     * Will Only DELETE if `this.tweet.byUserId` === `req.session.userId`.
     * This is to avoid deleting other users' tweets.
     */

    const tweetObject = {
        _id: new ObjectId(tweetid),
        byUserId: new ObjectId(userid),
    };

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const tweets = client.db("twitclone").collection("tweets");
            try {
                const result = await tweets.deleteOne(tweetObject);
                if (result.deletedCount === 0) throw new Error("Cannot delete tweet");
                res.status(200).send({ "deleted": result.deletedCount, "success": true });
            } catch (error) {
                res.status(400).send({ message: error.message });
            } finally {
                await client.close();
            }
        }).catch(next);
});

/*error handler */
router.use((err, req, res, next) => {
    res.status(500).send({ message: "Oops! Something went wrong :(" });
    console.error("TWEET_ROUTE", err);
});

module.exports = router;
