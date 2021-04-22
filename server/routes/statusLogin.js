const express = require('express');
const router = express.Router();

//For Checking anytime if User is loggedin
// can be used as middleware on Frontend
router.get("/", (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.send({ "loggedin": false });
    } else
        return res.send({ "loggedin": true, "user": req.session.user.username });
});

module.exports = router;