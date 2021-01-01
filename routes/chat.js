const Auth = require('../middleware/auth');
const validUrl = require('../utils/valid_url');

/* @desc displays the chat page for the entered room
    if the url format is incorrect, redirects user back to homepage
*/

chatRouter = (req, res) => {
    
    // validate url format

    let rel_url = req.url;

    if(!validUrl(rel_url)) {

        res.redirect('/home');

    } else {

        const room = rel_url.substr(7, rel_url.length);
        res.render('chat', {username: req.session.username, room: room});

    }

};



module.exports = chatRouter;