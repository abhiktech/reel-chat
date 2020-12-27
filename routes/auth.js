const express = require('express');
const sha1 = require('sha1');
const router = express.Router();

const User = require('../models/User');

// @desc presents the login form
// @route GET /auth/login

router.get('/login', (req, res) => {
    res.render('login');
});

// @desc either logs in the user or redirects back to login page
// @route POST /auth/login

router.post('/login', async (req, res) => {
    
    const password_hash = sha1(req.body.password);

    const user = await User.findOne({username:req.body.username, password: password_hash});
    
    if(user) {

        // Configuring the session

        req.session.username = req.body.username;
        req.session.loggedIn = true;        

        res.send('Logged In!');

    } else {

        // Send a message to the user that user credentials do not match.
        // Also let the form informtion persist after submission.
        
        res.render('login');

    }

}); 

// @desc presents sign up form
// @route GET /auth/signup

router.get('/signup', (req, res) => {
    res.render('signup');
});

// @desc either signs in user or redirects back to signup page
// @route POST /auth/signup

router.post('/signup', async (req, res) => {

    const user = await User.findOne({username:req.body.username});

    if(user) {

        // Send a message to the user that user already exists with this username.
        // Also let the form informtion persist after submission.

        res.render('signup');

    } else {

        const password_hash = sha1(req.body.password);

        const new_user = new User({username: req.body.username, password: password_hash});
        await new_user.save();

        // Create a session and log user in.

        req.session.username = req.body.username;
        req.session.loggedIn = true;

        res.send('User created and Logged In!');

    }

});

// @desc logs the user out
// @rpute GET /auth/logout

router.get('/logout', (req, res) => {
    req.session.loggedIn = false;
    res.send('Logged out!');
});

module.exports = router;

