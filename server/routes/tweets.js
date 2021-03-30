const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URL;
const isLoggedin = require('../middleware/authchecker');
const router = express.Router();

//HANDLING TWEETS

/* GET ALL TWEETS */
router.get("/", (req, res, next) => {
    res.send("Here are all tweets");
});


/* GET ALL TWEETS FROM given USER */
router.get("/user/:userid", (req, res, next) => {
    const userid = req.params.userid;
    res.send(`Here are ALL tweets from USER: ${userid}`);
});


/* GET SINGLE TWEET!😐 */
//NEEDS joining to Users collection
router.get("/:tweetid", (req, res, next) => {
    const tweetid = req.params.tweetid;
    const agg = [
        {
            '$match': {
                '_id': ObjectId(tweetid) //tweetID
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'byUserId',
                'foreignField': '_id',
                'as': 'User'
            }
        }, {
            '$project': {
                'User._id': 0,
                'User.email': 0,
                'User.bio': 0,
                'User.password': 0,
                'User.datejoined': 0
            }
        }
    ];
    //connect to Db
    MongoClient.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(async (client) => {
        const tweets = client.db("twitclone").collection("tweets");
        try {
            const result  =  tweets.aggregate(agg, (err, result)=>{
                if(err){
                    throw new Error(err.message);
                }
                res.send(result.toArray())
            });
        } catch (error) {

        }

    }).catch(next);
});


/* GET ALL MY own TWEETS */
router.get("/mine/all", isLoggedin, (req, res, next) => {
    const userid = req.session.user.id;
    //retrieve data from db
    MongoClient.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(async (client) => {
        const tweets = client.db("twitclone").collection("tweets");
        try {
            const result = await tweets.find({ byUserId: userid }, { projection: { byUserId: 0 } })
                .sort({ dateposted: -1, byUserId: -1 })
                .limit(50)
                .toArray();
            if (!result) throw new Error('No tweets');
            res.send(result);
        } catch (error) {
            res.status(404).send(error);
        } finally {
            await client.close();
        }
    }).catch(next);
});


/* POST TWEET */
router.post("/", isLoggedin, (req, res, next) => {
    const userid = req.session.user.id;
    const { content } = req.body;
    let errors = []; // input errors

    //-----------START VALIDATION------------//
    function checkInputs() {
        let OK = true;
        const reg = /^[^><]+$/gi;

        if (!content || content.length < 0) {
            return false;
        }
        if (!reg.test(content)) {
            errors.push("Tweet contains invalid characters");
            OK = false;
        }
        if (content.length > 280) {
            errors.push("Max length of tweet exceeded");
            OK = false;
        }
        return OK;
    }

    const checkInputsResult = checkInputs();
    if (checkInputsResult === false) {
        res.status(422).send({ "message": errors, "success": false });
        return;
    } else postTweetToDatabase();

    //-----------END OF VALIDATION ABOVE------------//

    function postTweetToDatabase() {
        const tweetObject = {
            byUserId: userid,
            content: content,
            likes: 0,
            comments: 0,
            dateposted: new Date()
        };

        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then(async (client) => {
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
    }
});


/* DELETE SINGLE TWEET */
router.delete("/:tweetid", isLoggedin, (req, res, next) => {
    const tweetid = req.params.tweetid;
    //connect to Db
    MongoClient.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(async (client) => {
        const tweets = client.db("twitclone").collection("tweets");
        try {
            const result = await tweets.deleteOne({ _id: tweetid });
            res.status(200).send({ "success": true });
            console.log("DELETED ", result.result);
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
    console.error("TWEET_Error ", err);
});


module.exports = router;