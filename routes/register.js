const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'TwitClone: Register' });
    console.log('on register page');
});

module.exports = router;