/** to check if User is Loggedin */
const isLoggedin = (req, res, next) => {
    if(!req.session || !req.session.user){
        return res.status(401).send({"message": "Required to login first", "success": false});   
    } else next();
};

module.exports =  isLoggedin;