const bcrypt = require('bcrypt');
const mysql = require('mysql');
const path = require('path');
const pool = require(path.resolve(__dirname, '..', 'config', 'db.js'));

module.exports = {
  register(candidate) {
    return new Promise((resolve, reject) => {
      const {firstName, lastName, email, password} = candidate;
      const CRYPT_STEPS = 12;
      const hash = bcrypt.hashSync(password, CRYPT_STEPS);
      const insertQuery = 'INSERT INTO to_do_list.users (user_first_name, user_last_name, user_email, user_password) VALUES (?, ?, ?, ?)';
      const swap = [firstName, lastName, email, hash];
      const query = mysql.format(insertQuery, swap);
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }
        connection.query(query, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
            connection.release();
          }
        );
      });
    });
  },
  
  auth(username) {
    return new Promise((resolve, reject) => {
      const insertQuery = 'SELECT * FROM to_do_list.users WHERE user_email = ?';
      const swap = [username];
      const query = mysql.format(insertQuery, swap);
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }
        connection.query(query, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
            connection.release();
          }
        );
      });
    });
  },
};
