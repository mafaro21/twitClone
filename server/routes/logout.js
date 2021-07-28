const express = require("express");
const isLoggedin = require("../middleware/authchecker");
const router = express.Router();

router.post("/", isLoggedin, (req, res, next) => {
        req.session.destroy((err) => {
            if (err) throw err;
            return res.send({ message: "logged out", success: true });
        });
});

module.exports = router;
