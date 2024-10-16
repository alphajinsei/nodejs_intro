const express = require('express');
const router = express.Router();

const knex = require("../db/knex");


/* GET home page. */
router.get('/', function(req, res, next) {


  res.render('signup', {
    title: 'Sign up', 
  });

});

router.post('/', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const repassword = req.body.repassword;

  knex("users")
  .where({name: username})
  .select("*")
  .then(function(results) {
    console.log(results);
    if (results.length !== 0){
      console.log('ユーザー名重複');
      res.render('signup', {
        title: 'Sign up',
        errorMessage: ["このユーザ名は既に使われています"],
      });
    } else if (password === repassword) {
      knex("users")
      .insert({name: username, password: password})
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
        });
      });
    } else {
      console.log('パスワード不一致');
      res.render('signup', {
        title: 'Sign up',
        errorMessage: ["パスワードが一致しません"],
      });
    }
  })
  .catch(function (err){
    console.error(err);
    res.render("signup", {
      title: 'Sign up',
      errorMessage: [err.sqlMessage],
    });
  });

});

module.exports = router;
