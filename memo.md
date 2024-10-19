# todoappプロジェクト初期化時に実施したこと
```bash
sudo su - 

# Node.jsインストール
yum install -y oracle-release-el7 oracle-nodejs-release-el7
yum install -y --disablerepo=ol7_developer_EPEL nodejs

# expressフレームワーク、ejsをインストール
# グローバルインストール(-g)なので全体に入る
sudo npm install -g --save express-generator
sudo npm install -g --save ejs

# プロジェクトの作成
cd todoapp/
express --view=ejs todoapp # ディレクトリが一式作成される
npm install # 依存関係のあるモジュールを入れる。グローバル指定ではないのでカレントディレクトリのプロジェクトにのみ入る
npm start 

# 追加
npm install mysql
npm install mysql2
npm install knex
npx knex init    ★tododapp/配下にknexfile.jsが生成される
npm install cookie-session
npm install bcrypt@5.1.0
npm install passport@0.5 passport-local
npm install connect-flash
```



# chapter12 データベースを学ぼう


### 手順

```
mysql> create database todo_app;
Query OK, 1 row affected (0.01 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| mysql_audit        |
| performance_schema |
| sys                |
| testdb             |
| todo_app           |
+--------------------+
7 rows in set (0.00 sec)

mysql> create table todo_app.users(id int unsigned auto_increment not null, name varchar(255) unique, password varchar(255), PRIMARY KEY (id));
Query OK, 0 rows affected (0.05 sec)

mysql> use todo_app
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql>
mysql>
mysql> show tables;
+--------------------+
| Tables_in_todo_app |
+--------------------+
| users              |
+--------------------+
1 row in set (0.00 sec)

mysql> create table todo_app.tasks (id int unsigned auto_increment not null, user_id int not null, content varchar(255) not null, PRIMARY KEY (id));
Query OK, 0 rows affected (0.02 sec)

mysql>
mysql>
mysql>
mysql> show tables;
+--------------------+
| Tables_in_todo_app |
+--------------------+
| tasks              |
| users              |
+--------------------+
2 rows in set (0.00 sec)

mysql> desc users;
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int unsigned | NO   | PRI | NULL    | auto_increment |
| name     | varchar(255) | YES  | UNI | NULL    |                |
| password | varchar(255) | YES  |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
3 rows in set (0.00 sec)

mysql> desc tasks;
+---------+--------------+------+-----+---------+----------------+
| Field   | Type         | Null | Key | Default | Extra          |
+---------+--------------+------+-----+---------+----------------+
| id      | int unsigned | NO   | PRI | NULL    | auto_increment |
| user_id | int          | NO   |     | NULL    |                |
| content | varchar(255) | NO   |     | NULL    |                |
+---------+--------------+------+-----+---------+----------------+
3 rows in set (0.01 sec)

mysql> create user 'todoapp_user' identified by 'P@ssw0rd';
Query OK, 0 rows affected (0.00 sec)

mysql> grant all on todo_app.* to 'todoapp_user';
Query OK, 0 rows affected (0.01 sec)

mysql>
mysql>
mysql> select host, user from mysql.user;
+-----------+--------------------+
| host      | user               |
+-----------+--------------------+
| %         | admin              |
| %         | administrator      |
| %         | ocirpl             |
| %         | test               |
| %         | todoapp_user       |
| 127.0.0.1 | ociadmin           |
| 127.0.0.1 | ocidbm             |
| localhost | mysql.infoschema   |
| localhost | mysql.session      |
| localhost | mysql.sys          |
| localhost | oracle-cloud-agent |
| localhost | rrhhuser           |
+-----------+--------------------+
12 rows in set (0.01 sec)

mysql> exit
Bye
[opc@my-instance4 nodejs_intro]$ mysql -u todoapp_user -p -h my-mysql.sub10081004581.myvcn.oraclevcn.com -P 3306
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3370
Server version: 9.0.1-u1-cloud MySQL Enterprise - Cloud

Copyright (c) 2000, 2024, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```



### その他手順おぼえがき

```
mysql> CREATE DATABASE testdb;
mysql> CREATE USER 'test' IDENTIFIED BY 'Demo#1Demo#1';
mysql> GRANT ALL ON testdb.* TO 'test';
mysql> USE testdb
mysql> CREATE TABLE dept (deptno INT , dname VARCHAR(14), loc VARCHAR(13), PRIMARY KEY  (deptno));
mysql> INSERT INTO dept VALUES (10,'ACCOUNTING','NEW YORK');
mysql> INSERT INTO dept VALUES (20,'RESEARCH','DALLAS');
mysql> INSERT INTO dept VALUES (30,'SALES','CHICAGO');
mysql> INSERT INTO dept VALUES (40,'OPERATIONS','BOSTON');
mysql> COMMIT;

mysql> SELECT * FROM dept;
+--------+------------+----------+
| deptno | dname      | loc      |
+--------+------------+----------+
|     10 | ACCOUNTING | NEW YORK |
|     20 | RESEARCH   | DALLAS   |
|     30 | SALES      | CHICAGO  |
|     40 | OPERATIONS | BOSTON   |
+--------+------------+----------+



show databases;
select host, user from mysql.user;

use testdb;
show tables;
show table status;
```

### 参考

* https://qiita.com/CyberMergina/items/f889519e6be19c46f5f4
* https://zenn.dev/wkb/books/node-tutorial/viewer/todo_04
* https://alphajinsei.hatenablog.com/entry/2024/10/14/040354





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



```sh
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




# chapter14 knex.jsでデータベースを操作しよう
 
* 今回DB接続用クライアントはmysql2を利用している
* 接続先DBはlocalhostではなくOCI上にある

ことから、todoapp/knexfile.jsを以下のように修正

```json
// Update with your config settings.

module.exports = {

  development: {
    client: "mysql2", // clientはmysqlに変更
    connection: {
      database: "todo_app",
      user: "todoapp_user",
      password: "P@ssw0rd",
      host: 'my-mysql.sub10081004581.myvcn.oraclevcn.com',　// ホスト名を追加
    },
    pool: {
      min: 2,
      max: 10
    },
  },
 //他も同様
};
```

# chapter16 bootstrap
Bootstrap CDNなるサイトからcssを引っ張ってきている
https://www.bootstrapcdn.com/

以下をheadタグ内に入れてcssを読む
```html
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
```

以下をbodyの一番最後に入れて、javascriptを読みこむ
* 1つ目はjQueryの読み込み。bootstrapがjQueryのライブラリを使っているため
* 2つ目はpopper.jsの読み込み。bootstrapのポップアップ機能で利用。
* 3つ目が肝心のbootstrapのjavascript読み込み。
```html
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
```


# chapter17 パスワードを安全に保存しよう

```sh
npm install bcrypt
```
したのち、`npm start`でサーバを立ち上げようとしたところ、以下のエラーに。

```sh
[opc@my-instance4 todoapp]$ npm start 

> todoapp@0.0.0 start
> node ./bin/www

node:internal/modules/cjs/loader:1282
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: /lib64/libstdc++.so.6: version `CXXABI_1.3.8' not found (required by /home/opc/nodejs_intro/chapter17/todoapp/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node)
    at Object.Module._extensions..node (node:internal/modules/cjs/loader:1282:18)
    at Module.load (node:internal/modules/cjs/loader:1076:32)
    at Function.Module._load (node:internal/modules/cjs/loader:911:12)
    at Module.require (node:internal/modules/cjs/loader:1100:19)
    at require (node:internal/modules/cjs/helpers:119:18)
    at Object.<anonymous> (/home/opc/nodejs_intro/chapter17/todoapp/node_modules/bcrypt/bcrypt.js:6:16)
    at Module._compile (node:internal/modules/cjs/loader:1198:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1252:10)
    at Module.load (node:internal/modules/cjs/loader:1076:32)
    at Function.Module._load (node:internal/modules/cjs/loader:911:12) {
  code: 'ERR_DLOPEN_FAILED'
}
```

/lib64/libstdc++.so.6にCXXABI_1.3.8が入っていないとのエラー。
確かに存在しない。暗号化モジュール(bcrypt)なので、「直近のライブラリを使え」とうるさいとか、そういう話と思われる
```sh
[opc@my-instance4 todoapp]$ strings /lib64/libstdc++.so.6 | grep CXXABI
CXXABI_1.3
CXXABI_1.3.1
CXXABI_1.3.2
CXXABI_1.3.3
CXXABI_1.3.4
CXXABI_1.3.5
CXXABI_1.3.6
CXXABI_1.3.7
CXXABI_TM_1
```

yum で最新化しても解消せず。元のOSのバージョンによって決まる上限がある？
```
sudo su - 
yum install gcc gcc-c++
yum update libstdc++
```

結局、以下記事の通り、bcryptをダウングレードして解消した。
```
npm install bcrypt@5.1.0
```

https://stackoverflow.com/questions/77334688/cpanel-error-lib64-libstdc-so-6-version-cxxabi-1-3-8-not-found

# chapter18 passportを利用した認証を実装しよう

* シリアライズ
  * 一般的には、オブジェクト/クラスのデータをバイト列の形式にすること。クライアント・サーバ間で、ネットワーク越しにデータを送る際にこのような形式で送るため。
  * ここでは、「ユーザー」というデータ/オブジェクト/クラスの塊の中から、ユーザーidの情報だけ抽出して簡便な形式に落とし込むことを指す模様。
  * デシリアライズ：
  * 一般的には、バイト列から元のオブジェクトを復元することを指す。
  * ここでは、ユーザーidから、ユーザーというクラス/オブジェクトを復元することを指している模様

今回のtodoappでは、
* 認証が発生したタイミングで、「ユーザー」のうちユーザidの情報だけを抜き出し(シリアライズ)、クライアント側で持っているcookieにユーザーidの情報(=シリアライズ化された情報)を書き込んでおく。
* それ以降、通信が発生するたびに、クライアントはcookieに保存された自分のユーザidの情報をサーバに毎回送信する。サーバ側では、受け取ったユーザidの情報から、都度対応する「ユーザ」というクラス/オブジェクト(id, ユーザー名, pwを持つ)の情報を復元(デシリアライズ)する
という世界観で動いている。

```sh
npm install passport
```
した状態でログイン試行すると、以下のエラーになった。
`TypeError: req.session.regenerate is not a function`と
`TypeError: req.flash is not a function`でそれぞれエラーになっている。

```sh
[opc@my-instance4 todoapp]$ npm start 

> todoapp@0.0.0 start
> node ./bin/www

GET /signin 304 30.545 ms - -
TypeError: req.session.regenerate is not a function
    at SessionManager.logIn (/home/opc/nodejs_intro/chapter18/todoapp/node_modules/passport/lib/sessionmanager.js:28:15)
    at IncomingMessage.req.login.req.logIn (/home/opc/nodejs_intro/chapter18/todoapp/node_modules/passport/lib/http/request.js:39:26)
    at Strategy.strategy.success (/home/opc/nodejs_intro/chapter18/todoapp/node_modules/passport/lib/middleware/authenticate.js:265:13)
    at verified (/home/opc/nodejs_intro/chapter18/todoapp/node_modules/passport-local/lib/strategy.js:83:10)
    at /home/opc/nodejs_intro/chapter18/todoapp/config/passport.js:36:18
/home/opc/nodejs_intro/chapter18/todoapp/node_modules/passport/lib/middleware/authenticate.js:134
          req.flash(type, msg);
              ^

TypeError: req.flash is not a function
    at allFailed (/home/opc/nodejs_intro/chapter18/todoapp/node_modules/passport/lib/middleware/authenticate.js:134:15)
    at attempt (/home/opc/nodejs_intro/chapter18/todoapp/node_modules/passport/lib/middleware/authenticate.js:183:28)
    at Strategy.strategy.fail (/home/opc/nodejs_intro/chapter18/todoapp/node_modules/passport/lib/middleware/authenticate.js:314:9)
    at verified (/home/opc/nodejs_intro/chapter18/todoapp/node_modules/passport-local/lib/strategy.js:82:30)
    at /home/opc/nodejs_intro/chapter18/todoapp/config/passport.js:43:16
[opc@my-instance4 todoapp]$ 
```

### `TypeError: req.session.regenerate is not a function`のエラーについて

chatgptによると、
* cookie-sessionではなくexpress-session を使え
* express-sessionではサーバ側でセッション情報を保管するが、cookie-sessionではセッション情報をクッキーとしてクライアント側に保存するので、`req.session.regenerate`といったサーバサイドのセッション操作をサポートしなくてエラーになっている
とのこと。もっともらしいが未検証。今回はせっかくなのでクッキーによるセッション管理で続けたい。


調べたところどうも直近版のpassportは後方互換性がなく類似のエラーが報告されていて、
```sh
npm install passport@0.5
```
でダウングレードしたところ解消。
https://stackoverflow.com/questions/72375564/typeerror-req-session-regenerate-is-not-a-function-using-passport


# `TypeError: req.flash is not a function`のエラーについて
`connect-flash`なるモジュールのインストールが追加で必要だった。

https://tyoshikawa1106.hatenablog.com/entry/2016/04/01/091509

```sh
npm install connect-flash
```
したのち、以下を追記して解消

```sh
const passport = require("passport");
const LocalStrategy = require('passport-local');
const knex = require("../db/knex");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const cookieSession = require("cookie-session");
const secret = "secretCuisine123";
const flash = require("connect-flash");　　★追記



module.exports = function (app) {
  passport.serializeUser(function (user, done) {
    console.log("serializeUser");
    done(null, user.id);
  });
  
  passport.deserializeUser(async function (id, done) {
    console.log("deserializeUser");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error){
      done(error, null);
    }
  });

  passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
  }, function (username, password, done) {
    knex("users")
      .where({ name: username })
      .select("*")
      .then(async function (results) {
        if (results.length === 0) {
          return done(null, false, { message: "No User Found" });
        } else if (await bcrypt.compare(password, results[0].password)) {
          return done(null, results[0]);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      })
      .catch(function (err) {
        console.error(err);
        return done(null, false, { message: err.toString() });
      });
  }));

  app.use(
    cookieSession({
      name: "session",
      keys: [secret],

      // Cookie Options
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  );
  app.use(flash());　　★追記
  app.use(passport.initialize());
  app.use(passport.session());
};
```