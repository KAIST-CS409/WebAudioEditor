var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session;
    var username = req.session.username;
    console.log(username);
    var isLoggedIn = true;
    if (typeof username === "undefined") {
        username = "";
        isLoggedIn = false;
    }
    res.render('library', { title: 'Web Audio Editor', username: username, isLoggedIn: isLoggedIn});
});

module.exports = router;
