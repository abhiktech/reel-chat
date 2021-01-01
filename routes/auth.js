const express = require('express');
const sha1 = require('sha1');
const router = express.Router();

const Auth = require('../middleware/auth');
const User = require('../models/User');

// @desc presents the login form
// @route GET /auth/login

router.get('/login', Auth.ensureGuest, (req, res) => {
    res.render('login');
});

// @desc either logs in the user or redirects back to login page
// @route POST /auth/login

router.post('/login', Auth.ensureGuest, async (req, res) => {
    
    const password_hash = sha1(req.body.password);

    const user = await User.findOne({username:req.body.username, password: password_hash});
    
    if(user) {

        // Configuring the session

        req.session.username = req.body.username;
        req.session.loggedIn = true;        
        
        res.redirect('/home');

    } else {

        res.render('login', {invalidCredentials: true});

    }

}); 

// @desc presents sign up form
// @route GET /auth/signup

router.get('/signup', Auth.ensureGuest, (req, res) => {
    res.render('signup');
});

// @desc either signs in user or redirects back to signup page
// @route POST /auth/signup

router.post('/signup', Auth.ensureGuest, async (req, res) => {

    const user = await User.findOne({username:req.body.username});

    if(user) {

        res.render('signup', {usernameExists: true});

    } else {

        const password_hash = sha1(req.body.password);

        const new_user = new User({username: req.body.username, password: password_hash});
        await new_user.save();

        // Create a session and log user in.

        req.session.username = req.body.username;
        req.session.loggedIn = true;

        res.redirect('/home');

    }

});

// @desc logs the user out
// @rpute GET /auth/logout

router.get('/logout', Auth.ensureAuth, (req, res) => {
    req.session.loggedIn = false;
    res.redirect('/auth/login');
});

module.exports = router;

