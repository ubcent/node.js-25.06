const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'to_do_list',
  user: 'root',
  password: 'jukjuk'
});

module.exports = pool;
