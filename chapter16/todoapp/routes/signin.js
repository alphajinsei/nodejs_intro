const express = require('express');
const router = express.Router();

const knex = require("../db/knex");


/* GET home page. */
router.get('/', function(req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  res.render('signin', {
    title: 'Sign in', 
    isAuth: isAuth,
  });
});

router.post('/', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  knex("users")
  .where({name: username, password: password})
  .then(function (results){
    if (results.length === 0){
      res.render('signin', {
        title: 'Sign in', 
        errorMessage: ["ユーザが見つかりません"],
        isAuth: isAuth,
      });
    } else {
      req.session.userid = results[0].id;
      res.redirect('/');
    }
  })
  .catch(function (err){
    console.error(err);
    res.render('signin', {
      title: 'Sign in', 
      errorMessage: [err.sqlMessage],
      isAuth: false,
    });
  });

});

module.exports = router;
