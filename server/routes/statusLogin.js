const express = require('express');
const router = express.Router();

//For Checking anytime if User is loggedin
// can be used as middleware on Frontend
router.get("/", (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.json({ "loggedin": false });
    } else
        return res.json({ "loggedin": true, "userID": req.session.user.id });
});

module.exports = router;