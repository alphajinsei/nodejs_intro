expressを動かすには、

* プロジェクトとなるディレクトリを作って
* プロジェクトを初期化して(`npm init --yes`)
* expressモジュールをインストールする(`npm install express`)

必要がある。

https://zenn.dev/wkb/books/node-tutorial/viewer/8

https://qiita.com/ryome/items/16659012ed8aa0aa1fac

```sh
[opc@my-instance4 nodejs_intro]$ cd chapter8
[opc@my-instance4 chapter8]$ npm init --yes
Wrote to /home/opc/nodejs_intro/chapter8/package.json:

{
  "name": "chapter8",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}


[opc@my-instance4 chapter8]$ ll
合計 8
-rw-rw-r--. 1 opc opc 274 10月 14 10:47 index.js
-rw-rw-r--. 1 opc opc 222 10月 14 10:52 package.json
[opc@my-instance4 chapter8]$ npm install express 

added 65 packages, and audited 66 packages in 8s

13 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
[opc@my-instance4 chapter8]$ ll
合計 60
-rw-rw-r--.  1 opc opc   274 10月 14 10:47 index.js
drwxrwxr-x. 66 opc opc  4096 10月 14 10:53 node_modules
-rw-rw-r--.  1 opc opc 46647 10月 14 10:53 package-lock.json
-rw-rw-r--.  1 opc opc   272 10月 14 10:53 package.json
```


これができたら、以下のindex.jsを作って動かし、ブラウザから確認する。
```
[opc@my-instance4 chapter8]$ cat index.js 
const port = 3000;
const express = require("express");
const app = express();

app.get("/", (request, response)=> {
    response.send("<h1>Hello Express.js!</h1>");
}).listen(port, ()=> {
    console.log(`The server has started and is listening on port number: ${port}`);
})
[opc@my-instance4 chapter8]$ node index.js 
The server has started and is listening on port number: 3000
^C
```