const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'todo',
  user: 'root',
  password: '',
});

/* {
  id: number;
  title: string;
  description: string;
  status: not_started | in_progress | completed;
  updated: timestamp;
} */
module.exports = {
  getAll() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject();
        }
        connection.query('SELECT * from `tasks` WHERE 1', (err, rows) => {
          if(err) {
            reject();
          }

          resolve(rows);

          // возвращаем соединение в пул
          connection.release();
        });
      });
    });
  },
  get(id) {},
  add(task) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
        connection(
          'INSERT INTO `tasks` ?',
          task,
          (err, result) => {
            if(err) {
              reject(err);
            }

            resolve(result.insertId);

            connection.release();
          }
        )
      });
    });
  },
  update(id, task) {},
  complete(id) {},
  delete(id) {},
}