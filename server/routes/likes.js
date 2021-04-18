const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const isLoggedin = require("../middleware/authchecker");
const router = express.Router();
const uri = process.env.MONGO_URL;
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const rateLimit = require("express-rate-limit"); // store it later in REDIS


//setup rate limit
const LikeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50, //==> 100 hits in 5 minute window.
  message: { "message": "Too many requests, try again in 5 mins" }
});


/* COUNT MY LIKES on A TWEET => 1 or 0 */
router.get("/me/:tweetid", isLoggedin, (req, res, next) => {
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
router.post("/:tweetid", isLoggedin, LikeLimiter, (req, res, next) => {
  const userid = req.session.user.id;
  const tweetid = req.params.tweetid;
  if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

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
router.delete("/:tweetid", isLoggedin, LikeLimiter, (req, res, next) => {
  const userid = req.session.user.id;
  const tweetid = req.params.tweetid;

  if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

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


/*error handler */
router.use((err, req, res, next) => {
  res.sendStatus(500);
  console.error("LIKE_Error ", err);
});
module.exports = router;
