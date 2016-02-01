var express = require('express');
var router = express.Router();
var knex = require('../db/knex')

/* GET home page. */
// redirects to dashboard route
// need to put in middleware for non-logged in user
router.get('/', function(req, res, next) {
  res.redirect('/dashboard')
});

module.exports = router;
