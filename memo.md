# chapter13 ToDoタスクをデータベースに保存しよう

node.js, expressで動くAPサーバと、mysqlが乗ったDBサーバがあり、
APサーバ側で以下のコードを書き、mysqlへ接続したい。

```js
const express = require('express');
const router = express.Router();

let todos = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'ToDo App', 
    todos: todos,
  });
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
  todos.push(todo);
  res.redirect('/');
});

module.exports = router;
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'my-mysql.sub10081004581.myvcn.oraclevcn.com', 
  user: 'todoapp_user', 
  password: 'P@ssw0rd', 
  database: 'todo_app'
})
```


上記でサーバを立ち上げてリクエストを送ったところ、DB接続時に以下のエラーが発生した。

```sh
[opc@my-instance4 todoapp]$ npm start 

> todoapp@0.0.0 start
> node ./bin/www

GET / 200 24.458 ms - 388
GET /stylesheets/style.css 304 1.886 ms - -
POST / 302 49.337 ms - 46
error connecting: Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
    at Handshake.Sequence._packetToError (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/protocol/sequences/Sequence.js:47:14)
    at Handshake.ErrorPacket (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/protocol/sequences/Handshake.js:123:18)
    at Protocol._parsePacket (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/protocol/Protocol.js:291:23)
    at Parser._parsePacket (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/protocol/Parser.js:433:10)
    at Parser.write (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/protocol/Parser.js:43:10)
    at Protocol.write (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/protocol/Protocol.js:38:16)
    at Socket.<anonymous> (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/Connection.js:88:28)
    at Socket.<anonymous> (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/Connection.js:526:10)
    at Socket.emit (node:events:513:28)
    at addChunk (node:internal/streams/readable:315:12)
    --------------------
    at Protocol._enqueue (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/protocol/Protocol.js:144:48)
    at Protocol.handshake (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/protocol/Protocol.js:51:23)
    at Connection.connect (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/mysql/lib/Connection.js:116:18)
    at /home/opc/nodejs_intro/chapter13/todoapp/routes/index.js:15:14
    at Layer.handle [as handle_request] (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/express/lib/router/layer.js:95:5)
    at next (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/express/lib/router/route.js:112:3)
    at Layer.handle [as handle_request] (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/express/lib/router/layer.js:95:5)
    at /home/opc/nodejs_intro/chapter13/todoapp/node_modules/express/lib/router/index.js:281:22
    at Function.process_params (/home/opc/nodejs_intro/chapter13/todoapp/node_modules/express/lib/router/index.js:335:12)
GET / 200 10.411 ms - 432
GET /stylesheets/style.css 304 0.665 ms - -
^C
[opc@my-instance4 todoapp]$ 
```

原因は、mysql8.0という新しいmysqlのバージョンでは、
デフォルトの認証プラグインがmysql_native_password → caching_sha2_password に代わっていることが原因。
DBが新しくなったのにmysqlクライアント側が古い認証方式で接続しようとしてしまっている。

下記記事では、ログインしたいユーザーのプラグインを古いものに修正することで対処しているが、

https://qiita.com/harukin721/items/99c606364a012cceb0d8

手元ではうまくいかず。OCIのマネージドサービスだからかそういう脆弱な要素は残してもらえないのか。

```sql
mysql> ALTER USER 'todoapp_user'@'%' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
ERROR 1524 (HY000): Plugin 'mysql_native_password' is not loaded
mysql> 
```

上記記事の「終わりに」にあった、以下の方法で対処して疎通できた。

```sh
npm install mysql2
```

```js
const express = require('express');
const router = express.Router();

let todos = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'ToDo App', 
    todos: todos,
  });
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
  todos.push(todo);
  res.redirect('/');
});

module.exports = router;
const mysql = require('mysql2');　　★修正
const connection = mysql.createConnection({
  host: 'my-mysql.sub10081004581.myvcn.oraclevcn.com', 
  user: 'todoapp_user', 
  password: 'P@ssw0rd', 
  database: 'todo_app'
})
```



```
[opc@my-instance4 todoapp]$ npm start 

> todoapp@0.0.0 start
> node ./bin/www

GET / 200 15.253 ms - 388
GET /stylesheets/style.css 304 3.742 ms - -
success
POST / 302 24.017 ms - 46
GET / 200 3.169 ms - 432
GET /stylesheets/style.css 304 0.730 ms - -

```