const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/javascript', function(req, res, next) {
    res.render('validate', {});
    console.log('we are using javascript page');
});

module.exports = router;