var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var sess = req.session;
  res.render('index', { title: 'Web Audio Editor' });
});

module.exports = router;
