// Update with your config settings.

module.exports = {

  development: {
    client: "mysql2",
    connection: {
      database: "todo_app",
      user: "todoapp_user",
      password: "P@ssw0rd",
      host: 'my-mysql.sub10081004581.myvcn.oraclevcn.com',
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  staging: {
    client: "mysql2",
    connection: {
      database: "todo_app",
      user: "todoapp_user",
      password: "P@ssw0rd",
      host: 'my-mysql.sub10081004581.myvcn.oraclevcn.com',
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  production: {
    client: "mysql2",
    connection: {
      database: "todo_app",
      user: "todoapp_user",
      password: "P@ssw0rd",
      host: 'my-mysql.sub10081004581.myvcn.oraclevcn.com',
    },
    pool: {
      min: 2,
      max: 10
    },
  }

};