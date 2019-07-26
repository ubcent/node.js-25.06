const mysql = require('mysql');

const pool = mysql.createPool({
    host: '10.30.1.59',
    database: 'todo',
    user: 'nodejs',
    password: '1qaz!QAZ',
    port: 3306,
    connectionLimit : 10,
});

module.exports = {
    getAll() {
        return new Promise((resolve, reject) => {
            const sql = mysql.format('select * from listTask;');
            pool.query('select * from listTask;', (err, rows, fields) => {
                if (err) {
                    reject('Error occurred ' + err);
                }
                resolve(rows);
            });
        });
    },
    getById(id) {
        return new Promise((resolve, reject) => {
            const sql = mysql.format('select * from listTask where num = ?;', [id]);
            pool.query(sql, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
};

