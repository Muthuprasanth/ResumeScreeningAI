var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/tasks', function(req, res, next) {
  console.log("ResumeScreening AI")
  res.render('index', { title: 'Express' });
});

module.exports = router;
