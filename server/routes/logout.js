const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
    req.session.destroy(err => {
        if (err) console.error(err);
         return res.send({ 'message': "logged out", "success": true });
    });
});


module.exports = router;