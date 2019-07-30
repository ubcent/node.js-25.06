const mysql = require('mysql');
const pool = mysql.createPool({
  host: 'localhost',
  database: 'todo',
  user: 'root',
  password: 'root',
  port: 8889,
});

module.exports = pool;
