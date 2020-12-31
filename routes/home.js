const express = require('express');
const router = express.Router();

const Auth = require('../middleware/auth');

// @desc displays the user's homepage
// @route GET /home

router.get('/', Auth.ensureAuth, (req, res) => {
    
    res.render('home', {username: req.session.username});
});



module.exports = router;