const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'TwitClone: Home' });
    console.log('we are on home page');
});

module.exports = router;