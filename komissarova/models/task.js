const mysql = require('mysql');
const path = require('path');
const pool = require(path.resolve(__dirname, '..', 'config', 'db.js'));

module.exports = {
  getAll() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }
        const request = 'SELECT * FROM to_do_list.tasks';
        connection.query(request, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
          connection.release();
        });
      });
    });
  },
  
  add(newTask) {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO to_do_list.tasks (task_description) VALUES (?)';
      const swap = [newTask];
      const query = mysql.format(insertQuery, swap);
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }
        connection.query(query, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(true);
            connection.release();
          }
        );
      });
    });
  },
  
  update(data) {
    return new Promise((resolve, reject) => {
      const {id, description} = data;
      const updateQuery = `UPDATE to_do_list.tasks SET task_description = ? WHERE task_id = ?`;
      const swap = [description, id];
      const query = mysql.format(updateQuery, swap);
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }
        connection.query(query, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(true);
            connection.release();
          }
        );
      });
    });
  },
  
  remove(id) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }
        connection.query(
          `DELETE FROM to_do_list.tasks WHERE task_id=?`,
          id,
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(true);
            connection.release();
          }
        );
      });
    });
  },
};
