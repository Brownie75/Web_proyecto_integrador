const { canDeletePost } = require("./permissions/mod.js");

function authUser(req, res, next) {
    console.log(req.user)
    if(req.user == null){
        res.status(401);
        return res.send("Necesitas iniciar sessión");
    }
    next();
}

function authDeletePost(req, res, next) {
    if(!canDeletePost(req.user, req.params.id)){
        res.status(401);
        return res.send("Not allowed");
    }
    next();
}


module.exports = {
    authUser,
    authDeletePost
}