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
        res.render('index', { title: 'Web Audio Editor', username: username, isLoggedIn: isLoggedIn});
        return;
    }
    res.render('library_workspace', { title: 'Web Audio Editor', username: username, isLoggedIn: isLoggedIn});
});

module.exports = router;
/**
 * Created by harrykim on 2017. 6. 4..
 */
