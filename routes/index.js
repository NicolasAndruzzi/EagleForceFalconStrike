var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users/index');
});
router.get('/show', function(req, res, next) {
  res.render('posts/show');
});
router.get('/form', function(req, res, next) {
  res.render('posts/form');
});

module.exports = router;
