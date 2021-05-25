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
    message: { "message": "Too many requests, try again later" }
});


/** FOLLOW SOMEONE by userId */
router.post("/:userid", FollowLimiter, (req, res, next) => {
    const fromUserId = req.session.user.id;
    const toUserId = req.params.userid;

    if (!ObjectId.isValid(toUserId)) return res.sendStatus(400);
    /** 
     * Objectives:
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
                if (q1.insertedCount === 1) {
                    await users.updateOne({ _id: followObject.fromUserId }, { $inc: { "following": 1 } });
                    await users.updateOne({ _id: followObject.toUserId }, { $inc: { "followers": 1 } });
                    res.status(201).send({ "followed": q1.insertedCount, "success": true });
                }
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

    /** Objectives:
     * OPPOSITE of the above in FOLLOW block
     */
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
                if (q1.deletedCount === 1) {
                    await users.updateOne({ _id: followObject.fromUserId }, { $inc: { following: -1 } });
                    await users.updateOne({ _id: followObject.toUserId }, { $inc: { followers: -1 } });
                    res.status(200).send({ "unfollowed": q1.deletedCount, "success": true });
                }
            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        }).catch(next);
});


/** View someone's FOLLOWERS. (⚠ MUST BE Loggedin) */
router.get("/to/:userid", (req, res, next) => {
    const toUserId = req.params.userid; // the target user
    const lastFollowerId = req.query.lt || 0; // FOR paging, coming from client.

    const agg = [
        {
            $match: {
                toUserId: new ObjectId(toUserId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "fromUserId",
                foreignField: "_id",
                as: "User",
            },
        },
        {
            $project: {
                _id: 1,
                "User.fullname": 1,
                "User.username": 1,
                "User.bio": 1,
            },
        },
    ];

    //fetch from MongoDB
    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const follows = client.db("twitclone").collection("follows");
            try {
                const result = await follows.aggregate(agg).limit(50).toArray();
                if (result.length === 0) throw new Error("No followers");
                res.status(200).send(result);
            } catch (error) {
                res.status(404).send({ "message": error.message });
            } finally {
                await client.close();
            }
        }).catch(next);
});


/** View someone's FOLLOWING (⚠ MUST BE Loggedin) */
router.get("/from/:userid", (req, res, next) => {
    const fromUserId = req.params.userid; // the target user
    const lastFollowerId = req.query.lt || 0; // FOR paging, coming from client.

    const agg = [
        {
            $match: {
                fromUserId: new ObjectId(fromUserId),
                _id: { $lt: new ObjectId(lastFollowerId) },
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "toUserId",
                foreignField: "_id",
                as: "User",
            }
        },
        {
            $project: {
                _id: 1,
                "User.fullname": 1,
                "User.username": 1,
                "User.bio": 1,
            }
        }
    ];

    //fetch from MongoDB
    MongoClient.connect(uri, MongoOptions)
        .then(async (client) => {
            const follows = client.db("twitclone").collection("follows");
            try {
                const result = await follows.aggregate(agg).limit(50).toArray();
                if (result.length === 0) throw new Error("Not following anyone");
                res.status(200).send(result);
            } catch (error) {
                res.sendStatus(404);
            } finally {
                await client.close();
            }
        }).catch(next);

});

/** error handler */
router.use((err, req, res, next) => {
    res.status(500).send({
        message: "Oops! Something went wrong :(",
        success: false
    });
    console.error("FOLLOW_Error", err);
});


module.exports = router;