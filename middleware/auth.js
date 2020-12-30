module.exports.ensureGuest = (req, res, next) => {
    
    if(req.session.loggedIn) {
        res.redirect('/home');
    } else {
        return next();
    }

};

module.exports.ensureAuth = (req, res, next) => {

    if(req.session.loggedIn) {
        return next();
    } else {
        res.redirect('/auth/login');
    }

};