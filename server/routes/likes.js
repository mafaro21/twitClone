const express = require("express");
const isLoggedin = require("../middleware/authchecker");
const router = express.Router();

/* ADD ❤ LIKE ON A TWEET */
router.post("/:tweetid", isLoggedin, (req, res, next) => {
  const userid = req.session.user.id;
  const tweetid = req.params.tweetid;

  /* do two operations
    1. ADD NEW ENTRY to `likes` collection.
    2. Increment (+) the #Likes in the `tweets` collection (for this tweetid)  
    */
   
  res.send(`You liked a tweet with id ${tweetid}`);
});


/* REMOVE 🖤 LIKE ON A TWEET */
router.delete("/:tweetid", isLoggedin, (req, res, next) => {
  const userid = req.session.user.id;
  const tweetid = req.params.tweetid;

  /* do two operations
    1. REMOVE ENTRY from `likes` collection.
    2. Decrement (-) the #likes in the `tweets` collection (for this tweetid)  
    */

  res.send(`You UNLIKED a tweet with id ${tweetid}`);
});

module.exports = router;
