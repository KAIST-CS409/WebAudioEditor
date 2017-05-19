var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session;
    console.log(sess);
    var username = req.session.username;
    var isLoggedIn = true;
    if (typeof username === "undefined") {
        username = "";
        isLoggedIn = false;
    }
    res.render('index', { title: 'Web Audio Editor', username: username, isLoggedIn: isLoggedIn});
});

module.exports = router;
