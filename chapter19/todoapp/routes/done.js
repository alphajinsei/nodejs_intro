const express = require('express');
const router = express.Router();
const passport = require("passport");
const knex = require("../db/knex");




router.post('/', function(req, res, next) {
  const isAuth = req.isAuthenticated();
  const taskId = req.body.taskId;
  console.log(taskId);

  knex("tasks")
  .del()
  .where({id: taskId})
  .then(function(result) {
    res.redirect('/');
  })
  .catch(function(err){
    console.error(err);
    res.render('index', {
      title: 'Todo App',
      isAuth: isAuth,
    });
  });

});

module.exports = router;
