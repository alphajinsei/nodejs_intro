const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
