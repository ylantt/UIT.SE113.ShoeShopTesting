function ensureAuthenicated(req, res, next){
    if(!req.session.user){
        return res.status(403).redirect('/signInFirst');
    }
    else
        console.log("Logged in OK");
    next();
}

function authRole(req, res, next){
    if(!req.session.user){
        console.log("Logged in user Failed");
        return res.status(403).redirect('/signInFirst');
    }else {
        if(req.session.user.role != 1){
            console.log("Logged in admin failed. This is a client");
            return res.status(401).redirect('/permissiondenied');
        } else{
            res.status("200");
            console.log("Logged in admin OK");
        }
    }
    next();
}

module.exports ={
    ensureAuthenicated,
    authRole,
}