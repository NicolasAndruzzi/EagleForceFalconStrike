var express = require('express');
router = express.Router();

router.get('/', function(req, res, next) {
  res.send('auth page')
})


module.exports = router;
