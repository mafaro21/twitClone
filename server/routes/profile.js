const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const isLoggedin = require('../middleware/authchecker');
const router = express.Router();

//FOR PROFILE //


/* GETTING MY PROFILE */
router.get("/mine", isLoggedin, (req, res, next) => {
    let userid = req.session.user.id;
    MongoClient.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,

    }).then(client => {
        const users = client.db('twitclone').collection('users');
        const projection = { _id: 0, password: 0, email: 0 };
        users.findOne({ _id: userid },  { projection: projection}, async (err, result) => {
                if (err)  next(err);
                else { res.json(result); }
             await client.close();
            });
    }).catch(next);
});

/*  GETTING OTHER PEOPLEL */
router.get("/user/:userid", (req, res, next) => {
    let userid = req.params.userid;
    res.send(`Profile belongs to  ${userid}`);
});

/* handling PUT/(UPDATE PROFILE) requests */
router.put("/mine", isLoggedin, (req, res, next) => {

});

/*error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error(err);
});

module.exports = router;