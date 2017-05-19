var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('signin', { title: 'Web Audio Editor - Sign in' });
});

module.exports = router;
