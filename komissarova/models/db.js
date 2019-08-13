const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  database: 'to_do_list',
  user: 'root',
  password: 'jukjuk'
});

module.exports = db;