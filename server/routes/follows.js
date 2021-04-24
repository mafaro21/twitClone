const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();
const uri = process.env.MONGO_URL;
const MongoOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const rateLimit = require("express-rate-limit"); // store it later in REDIS

//setup rate limit
const FollowLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20, //==> 20 hits in 5 minute window.
    message: { "message": "Too many requests, try again in 5 mins" }
});

/** check if I Follow given User => 1 or 0 */
router.get("/to/:userid", (req, res, next) => {
    const fromUserId = req.session.user.id;
    const toUserId = req.params.userid;

    if (!ObjectId.isValid(toUserId)) return res.sendStatus(400);

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const follows = client.db("twitclone").collection("follows");
            const query = { fromUserId: new ObjectId(fromUserId), toUserId: new ObjectId(toUserId) };
            try {
                const myFollow = await follows.countDocuments(query);
                res.send({ "count": myFollow });
            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        }).catch(next);

});

/** FOLLOW SOMEONE by userId */
router.post("/:userid", FollowLimiter, (req, res, next) => {
    const fromUserId = req.session.user.id;
    const toUserId = req.params.userid;

    if (!ObjectId.isValid(toUserId)) return res.sendStatus(400);
    /** 
     * 
     * Objective:
     * 1. ADD a new entry to `follows` collection
     * 2. INCREMENT +1 the `following` count of Source user
     * 3. INCREMENT +1 the `followers` count of Target user.
     *  */

    const followObject = {
        fromUserId: new ObjectId(fromUserId),
        toUserId: new ObjectId(toUserId),
        date: new Date()
    };

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const follows = client.db("twitclone").collection("follows");
            const users = client.db("twitclone").collection("users");
            try {
                let q1 = await follows.insertOne(followObject);
                let q2 = await users.updateOne({ _id: followObject.fromUserId }, { $inc: { "following": 1 } });
                let q3 = await users.updateOne({ _id: followObject.toUserId }, { $inc: { "followers": 1 } });
                if (q1.insertedCount && q2.modifiedCount && q3.modifiedCount)
                    res.status(201).send({ "followed": q1.insertedCount, "success": true });
            } catch (error) {
                if (error.code === 11000) {
                    res.status(409).send({ "message": "Cannot follow User Twice", "success": false });
                } else throw error;
            } finally {
                await client.close();
            }
        }).catch(next);

});


/** UNFOLLOW SOMEONE by userId  */
router.delete("/:userid", FollowLimiter, (req, res, next) => {
    const fromUserId = req.session.user.id;
    const toUserId = req.params.userid;

    /** 
     * 
     * Objective:
     * 1. DELETE one entry from `follows` collection
     * 2. DECREMENT -1 the `following` count of Source user
     * 3. DECREMENT -1 the `followers` count of Target user.
     *  */

    const followObject = {
        fromUserId: new ObjectId(fromUserId),
        toUserId: new ObjectId(toUserId),
    };

    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const follows = client.db("twitclone").collection("follows");
            const users = client.db("twitclone").collection("users");
            try {
                let q1 = await follows.deleteOne(followObject);
                let q2 = await users.updateOne({ _id: followObject.fromuserid }, { $inc: { "following": -1 } });
                let q3 = await users.updateOne({ _id: followObject.touserid }, { $inc: { "followers": -1 } });
                if (q1.deletedCount && q2.modifiedCount && q3.modifiedCount)
                    res.status(200).send({ "unfollowed": q1.insertedCount, "success": true });
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
    console.error("FOLLOW_Error", err);
});


module.exports = router;