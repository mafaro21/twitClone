const express = require('express');
const router = express.Router();

router.get("/", (req, res, next)=>{
    req.session.destroy(err=>{
       if(err) console.error(err);
       res.redirect("/login");
    });
})


module.exports = router;