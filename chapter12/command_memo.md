
# 手順

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

```



# その他手順おぼえがき

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

# 参考

* https://qiita.com/CyberMergina/items/f889519e6be19c46f5f4
* https://zenn.dev/wkb/books/node-tutorial/viewer/todo_04
* https://alphajinsei.hatenablog.com/entry/2024/10/14/040354

