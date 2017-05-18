var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('signup', { title: 'Web Audio Editor - Sign up' });
});

module.exports = router;
