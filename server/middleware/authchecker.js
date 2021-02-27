const isLoggedin = (req, res, next) => {
    if(!req.sessions || !req.sessions.user){
        return res.status(401).send({"message": "Required to login first", "success": false});   
    } else next();
};

module.exports =  isLoggedin;