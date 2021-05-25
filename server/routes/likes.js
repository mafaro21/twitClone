const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();
const uri = process.env.MONGO_URL;
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const rateLimit = require("express-rate-limit"); // store it later in REDIS


//setup rate limit
const LikeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20, //==> 20 max hits in 5 minute window.
  message: { "message": "Too many requests, try again later" }
});


/* COUNT MY LIKES on A TWEET => 1 or 0 */
router.get("/me/:tweetid", (req, res, next) => {
  const userid = req.session.user.id;
  const tweetid = req.params.tweetid;
  if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

  MongoClient.connect(uri, MongoOptions)
    .then(async (client) => {
      const likes = client.db("twitclone").collection("likes");
      const query = { tweetid: new ObjectId(tweetid), userid: new ObjectId(userid) };
      try {
        const myLike = await likes.countDocuments(query);
        res.send({ "count": myLike });
      } catch (error) {
        throw error;
      } finally {
        await client.close();
      }
    }).catch(next);

});


/* ADD ❤ LIKE ON A TWEET */
router.post("/:tweetid", LikeLimiter, (req, res, next) => {
  const userid = req.session.user.id;
  const tweetid = req.params.tweetid;
  if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

  /** Objectives:
   * 1. ADD NEW ENTRY to `likes` collection
   * 2. INCREMENT +1 `count` of _likes_ in the referenced `tweet`
   */

  const likesObject = {
    tweetid: new ObjectId(tweetid),
    userid: new ObjectId(userid),
    dateliked: new Date()
  };

  MongoClient.connect(uri, MongoOptions)
    .then(async (client) => {
      const likes = client.db("twitclone").collection("likes");
      const tweets = client.db("twitclone").collection("tweets");
      try {
        const result1 = await likes.insertOne(likesObject);
        const result2 = await tweets.updateOne({ _id: likesObject.tweetid }, { $inc: { likes: 1 } });
        if (result1.result.ok && result2.result.ok)
          res.status(201).send({ success: true });
      } catch (error) {
        if (error.code === 11000) {
          res.status(409).send({ "message": "Cannot like same tweet twice", "success": false });
        } else throw error;
      } finally {
        await client.close();
      }
    }).catch(next);

});


/* REMOVE 🤍 LIKE ON A TWEET */
router.delete("/:tweetid", LikeLimiter, (req, res, next) => {
  const userid = req.session.user.id;
  const tweetid = req.params.tweetid;

  if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

  /** Objectives:
  * 1. REMOVE ENTRY from `likes` collection
  * 2. DECREMENT -1 `count` of _likes_ in the referenced `tweet`
  */
  const likesObject = {
    tweetid: new ObjectId(tweetid),
    userid: new ObjectId(userid)
  };

  MongoClient.connect(uri, MongoOptions)
    .then(async (client) => {
      const likes = client.db("twitclone").collection("likes");
      const tweets = client.db("twitclone").collection("tweets");
      try {
        const result1 = await likes.deleteOne(likesObject);
        const result2 = await tweets.updateOne({ _id: likesObject.tweetid }, { $inc: { likes: -1 } });
        if (result1.deletedCount === 1 && result2.modifiedCount === 1)
          res.status(200).send({ success: true });
      } catch (error) {
        throw error;
      } finally {
        await client.close();
      }
    }).catch(next);

});

/** FETCH ALL TWEETS LIKED BY USER */
router.get("/user/:userid", (req, res, next) => {
  const byUserId = req.params.userid;
  if (!ObjectId.isValid(byUserId)) return res.sendStatus(400);

  const agg = [
    {
      $match: {
        userid: new ObjectId(byUserId)
      }
    },
    {
      $sort: { _id: -1 }
    },
    {
      $limit: 20
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweetid",
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
        "oguser.username": 1
      }
    }
  ];

  //collect all retweets from db
  MongoClient.connect(uri, MongoOptions)
    .then(async (client) => {
      try {
        const likes = client.db("twitclone").collection("likes");
        const result = await likes.aggregate(agg).toArray();
        if (result.length === 0) throw new Error("No retweets by this user");
        res.status(200).send(result);
      } catch (error) {
        res.status(404).send({ "message": error.message });
        console.error(error);
      }
    }).catch(next);
});


/*error handler */
router.use((err, req, res, next) => {
  res.status(500).send({
    message: "Oops! Something went wrong :(",
    success: false
  });
  console.error("LIKE_Error", err);
});

module.exports = router;
