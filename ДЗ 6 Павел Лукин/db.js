const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('todo2.db');

module.exports = db;