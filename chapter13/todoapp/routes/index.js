const express = require('express');
const router = express.Router();


const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'my-mysql.sub10081004581.myvcn.oraclevcn.com', 
  user: 'todoapp_user', 
  password: 'P@ssw0rd', 
  database: 'todo_app'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query(
    `select * from tasks;`, 
    (error,results) =>{
      console.log(error);
      console.log(results);
      res.render('index', {
        title: 'ToDo App', 
        todos: results,
      });
    }
  );

});

router.post('/', function(req, res, next) {
  connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return
    }
    console.log('success');
  });

  const todo = req.body.add;

  connection.query(
    `insert into tasks (user_id,content) values (1, '${todo}');`,
    (error, results) =>{
      console.log(error);
      res.redirect('/');
    }
  );

});

module.exports = router;
