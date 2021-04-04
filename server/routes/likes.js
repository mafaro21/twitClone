const express = require("express");
const { MongoClient, ObjectId, ReplSet } = require("mongodb");
const isLoggedin = require("../middleware/authchecker");
const router = express.Router();
const uri = process.env.MONGO_URL;


//ADD rate limiter!! 20hits per minute.
//block for 5 minutes.
//==> 100 hits in 5 minute window.

/* ADD ❤ LIKE ON A TWEET */
router.post("/:tweetid", isLoggedin, (req, res, next) => {
  const userid = req.session.user.id;
  const tweetid = req.params.tweetid;
  if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

  const likesObject = {
    tweetid: tweetid,
    userid: userid,
    dateliked: new Date()
  }

  /* do two operations
    1. ADD NEW ENTRY to `likes` collection.
    2. Increment (+) the #Likes in the `tweets` collection (for this tweetid)  
    */

  MongoClient.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).then(async (client) => {
    const likes = client.db("twitclone").collection("likes");
    const tweets = client.db("twitclone").collection("tweets");
    try {
      const result1 = await likes.insertOne(likesObject);
      const result2 = await tweets.updateOne({ _id: new ObjectId(tweetid) }, { $inc: { likes: 1 } });
      if (result1.result.ok === 1 && result2.result.ok === 1)
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


/* REMOVE ❤ LIKE ON A TWEET */
router.delete("/:tweetid", isLoggedin, (req, res, next) => {
  const userid = req.session.user.id;
  const tweetid = req.params.tweetid;

  if (!ObjectId.isValid(tweetid)) return res.sendStatus(400);

  const likesObject = {
    tweetid: tweetid,
    userid: userid,
  }

  /* do two operations
    1. REMOVE ENTRY from `likes` collection.
    2. Decrement (-) the #likes in the `tweets` collection (for this tweetid)  
    */
  MongoClient.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).then(async (client) => {
    const likes = client.db("twitclone").collection("likes");
    const tweets = client.db("twitclone").collection("tweets");
    try {
      const result1 = await likes.deleteOne(likesObject);
      const result2 = await tweets.updateOne({ _id: new ObjectId(tweetid) }, { $inc: { likes: -1 } });
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
