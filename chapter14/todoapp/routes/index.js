const express = require('express');
const router = express.Router();

const knex = require("../db/knex");
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'my-mysql.sub10081004581.myvcn.oraclevcn.com', 
  user: 'todoapp_user', 
  password: 'P@ssw0rd', 
  database: 'todo_app'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  knex("tasks")
    .select("*")
    .then(function(results) {
      console.log(results);
      res.render('index', {
        title: 'ToDo App', 
        todos: results,
      });
    })
    .catch(function(err){
      console.error(err);
      res.render('index', {
        title: 'Todo App',
      });
    });


});

router.post('/', function(req, res, next) {
  const todo = req.body.add;
  knex("tasks")
    .insert({user_id: 1, content: todo})
    .then(function(){
      res.redirect('/')
    })
    .catch(function(err){
      console.error(err);
      res.render('index', {
        title: 'Todo App'
      });
    });
});

module.exports = router;
