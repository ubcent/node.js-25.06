// creating new object
const mysql = require('mysql');

//pool parameters
const pool = mysql.createPool({
    host: 'localhost',
    database: 'vova',
    user: 'vova',
    password: 'pass',
    charset: "utf8_general_ci"
});
pool.getConnection((err, connection) => {
    connection.query('set names utf8', (err, rows) => {
        connection.release();
    });
});


/* {
  id: number;
  title: string;
  description: string;
  status: not_started | in_progress | completed;
  updated: timestamp;
} */

//export module
module.exports = {
    //creating function getAll
    getAll() {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err) {
                    console.log("No connection to the database");
                    reject();
                }
                connection.query('SELECT * from `tasks` WHERE 1', (err, rows) => {
                    if(err) {
                        console.log("Your requst cannot be done");
                        reject();
                    }

                    resolve(rows);

                    // return conection
                    connection.release();
                });
            });
        });
    },
    get(id) {},
    //creating function add. Adds id.
    add(task) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err) {
                    reject(err);
                }
                connection.query(
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
    delete(id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err) {
                    reject(err);
                }
                connection.query(
                    'delete from `tasks` where id=?',
                    id,
                    (err, result) => {
                        if(err) {
                            reject(err);
                        }
                        resolve();
                        connection.release();
                    }
                )
            });
        });
    },
}