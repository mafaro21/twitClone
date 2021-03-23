const express = require("express");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const secret = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const axios = require("axios").default;
const router = express.Router();
const rateLimit = require("express-rate-limit"); // store it later in REDIS


//setup rate limit
const RegisterLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins window
    max: 5, // start blocking after 5 requests
    skipSuccessfulRequests: true,
    message: { "message": "Too many tries, try again in 15 mins" }
});


//FOR REGISTER ONLY::

/* handling GET requests  */
router.get("/", (req, res, next) => {
    res.send({ "title": " Twitclone Register" });
});

/* handling POST requests */
router.post("/", RegisterLimiter, (req, res, next) => {
    const { fullname, email, password, confirmPass, responseToken } = req.body;
    let errors = []; // input errors
    let isValid = false; // captcha result

    function checkInputs() {
        let OK = true;
        let reg = /^[ \p{Han}0-9a-zA-Z_\.\'\-]+$/;
        let emailpatt = /(^([0-9A-Za-z])[\w\.\-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;

        if (!fullname || !email || !password || !confirmPass) {
            //☹ if any empty, END immediately!
            errors.push("No field can be empty, ");
            return false;
        }
        if (!reg.test(fullname)) {
            errors.push("Name contains illegal characters, ");
            OK = false;
        }
        if (!emailpatt.test(email)) {
            errors.push("Email is invalid, ");
            OK = false;
        }
        if (password.length < 8) {
            errors.push("Required 8 or more characters, ");
            OK = false;
        }
        if (password !== confirmPass) {
            errors.push("Passwords do not match, ");
            OK = false;
        }
        return OK;
    };

    //-----------------BEGIN CAPTCHA VERIFICATION ---------------------------//
    const checkInputsResult = checkInputs();
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
            if ((isValid && checkInputsResult) === false) {
                res.status(422).send({ "message": errors, "success": false });
                return;
            } else addUserToDatabase();
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
                // IF SUCCESSFUL INSERT create session here.
                req.session.user = { id: result.insertedId, email: result.ops[0].email, };
                res.status(201).send({ "success": true });
                console.log(result.insertedId);
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
    console.error(err);
});

module.exports = router;