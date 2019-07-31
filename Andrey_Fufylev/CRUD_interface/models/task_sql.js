const mysql = require('mysql');
const path = require('path');
const pool = require(path.resolve(__dirname, '..', 'config', 'mysql_db_config'));

module.exports = {
  getAll() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if ( err ) {
          reject(err);
        }
        const request = `SELECT id, title, description, status,
                        DATE_FORMAT(updated, '%d.%m.%Y %k:%i') as update
                        FROM tasks`;
        connection.query(request, (err, rows) => {
          if ( err ) {
            reject(err);
          }
          resolve(rows);
          connection.release();
        });
      });
    });
  },
  get(id) {
    // TODO;
  },
  add(title, description, status) {
    return new Promise((resolve, reject) => {
      const insertQuery = 'INSERT INTO tasks (??,??,??) VALUES (?,?,?)';
      const swap = ['title', 'description', 'status', title, description, status];
      const query = mysql.format(insertQuery, swap);
      pool.getConnection((err, connection) => {
        if ( err ) {
          reject(err);
        }
        connection.query(query, (err, result) => {
          if ( err ) {
            reject(err);
          }
          resolve(result);
          connection.release();
        }
        );
      });
    });
  },
  update(task) {
    return new Promise((resolve, reject) => {
      const updateQuery = `UPDATE tasks
                            SET title = ?, description = ?, status = ?
                            WHERE tasks.id = ?`;
      const swap = [task.title, task.description, task.status, +task.id];
      const query = mysql.format(updateQuery, swap);
      pool.getConnection((err, connection) => {
        if ( err ) {
          reject(err);
        }
        connection.query(query, (err, result) => {
          if ( err ) {
            reject(err);
          }
          resolve(result);
          connection.release();
        }
        );
      });
    });
  },
  delete(id) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if ( err ) {
          reject(err);
        }
        connection.query(
            `DELETE FROM tasks WHERE id = ?`,
            id,
            (err, result) => {
              if ( err ) {
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
