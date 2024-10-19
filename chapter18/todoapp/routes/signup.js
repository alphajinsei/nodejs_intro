const express = require('express');
const router = express.Router();

const knex = require("../db/knex");
const bcrypt = require("bcrypt");


/* GET home page. */
router.get('/', function(req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  res.render('signup', {
    title: 'Sign up', 
    isAuth: isAuth,
  });

});

router.post('/', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const repassword = req.body.repassword;

  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  knex("users")
  .where({name: username})
  .select("*")
  .then(async function(results) {
    console.log(results);
    if (results.length !== 0){
      console.log('ユーザー名重複');
      res.render('signup', {
        title: 'Sign up',
        errorMessage: ["このユーザ名は既に使われています"],
        isAuth: isAuth,
      });
    } else if (password === repassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      knex("users")
      .insert({name: username, password: hashedPassword})
      .then(function(){
        //ここもう一回select してidとって
        // req.session.userid = results[0].id; しないと
        // アカウント作ってログインしたことにならない
        res.redirect("/");
      })
      .catch(function (err){
        console.error(err);
        res.render("signup", {
          title: 'Sign up',
          errorMessage: [err.sqlMessage],
          isAuth: isAuth,
        });
      });
    } else {
      console.log('パスワード不一致');
      res.render('signup', {
        title: 'Sign up',
        errorMessage: ["パスワードが一致しません"],
        isAuth: isAuth,
      });
    }
  })
  .catch(function (err){
    console.error(err);
    res.render("signup", {
      title: 'Sign up',
      errorMessage: [err.sqlMessage],
      isAuth: isAuth,
    });
  });

});

module.exports = router;
