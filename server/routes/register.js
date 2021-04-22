const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const secret = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const axios = require("axios").default;
const router = express.Router();
const rateLimit = require("express-rate-limit"); // store it later in REDIS
const { RegValidation } = require("../middleware/inputvalidation");


//setup rate limit
const RegisterLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins window
    max: 5, // block after 5 FAILED requests
    skipSuccessfulRequests: true,
    message: { "message": "Too many tries, try again in 15 mins" }
});


/* handling GET requests  */
router.get("/", (req, res, next) => {
    res.send({ "title": " Twitclone Register" });
});


/* handling POST requests */
router.post("/", RegisterLimiter, RegValidation, (req, res, next) => {
    const { fullname, email, password, responseToken } = req.body;
    
    // BEGIN CAPTCHA VERIFICATION ---------------------------// 
    let isValid = false; // captcha result
    const axiosOptions = {
        url: process.env.VERIFY_LINK,
        method: "POST",
        timeout: 5000,
        params: {
            secret: secret,
            response: responseToken
        }
    };

    axios.request(axiosOptions)
        .then(res => {
            isValid = res.data.success && (res.data.score >= 0.5); //check if both TRUE
            let prob = res.data['error-codes'];
            if (prob) throw prob;
            return isValid;
        })
        .then(isValid => {
            if (isValid === true) addUserToDatabase();
            else throw new Error();
        })
        .catch(err => {
            res.status(400).send({ "message": "CAPTCHA Error" });
            console.error("AXIOS", err);
        });
    //---------------------END OF VERIFICATION ABOVE ---------------------//

    async function addUserToDatabase() {
        //IF ALL IS OK..😀
        let randnum = Math.floor(Math.random() * 100 - 10);
        let newPass = await bcrypt.hash(password, 10);
        const userObject = {
            fullname: fullname,
            username: email.split(/[^a-zA-Z0-9]/)[0] + randnum,
            email: email,
            followers: 0,
            following: 0,
            bio: "Hello Twitclone, This is my default bio",
            password: newPass,
            datejoined: new Date(),
        };

        MongoClient.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then(async (client) => {
            const users = client.db("twitclone").collection("users");
            try {
                const result = await users.insertOne(userObject);
                // IF SUCCESSFUL, create session here.
                req.session.user = { "id": result.ops[0]._id, "username": result.ops[0].username };
                res.status(201).send({ "success": true });
            } catch (error) {
                if (error.code === 11000) {
                    res.status(409).send({ "message": "Email already in use.", "success": false });
                } else throw error;
            } finally {
                await client.close();
            }
        }).catch(next);
    }; // <--end of function

});


/*error handler */
router.use((err, req, res, next) => {
    res.sendStatus(500);
    console.error("REGISTER_Error ", err);
});

module.exports = router;