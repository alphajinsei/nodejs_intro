const express = require('express');
const router = express.Router();

const knex = require("../db/knex");
const bcrypt = require("bcrypt");

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
  .where({name: username})
  .then(async function (results){
    if (results.length === 0){
      res.render('signin', {
        title: 'Sign in', 
        errorMessage: ["ユーザが見つかりません"],
        isAuth: isAuth,
      });
    } else if (await bcrypt.compare(password, results[0].password)) {
      req.session.userid = results[0].id;
      res.redirect('/');
    } else {
      res.render('signin', {
        title: 'Sign in', 
        errorMessage: ["パスワードが誤っています"],
        isAuth: isAuth,
      });
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
