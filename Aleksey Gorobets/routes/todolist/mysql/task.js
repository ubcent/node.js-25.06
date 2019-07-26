const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'todo',
    user: 'nodejs',
    password: '1qaz!QAZ',
    port: 3306,
    connectionLimit : 10,
    multipleStatements : true
});

module.exports = {
    getAll() {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
//                if (err) {
//                    reject(err);
//                }
                connection.query('SELECT * from tasks;', (err, rows) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }
                    resolve(rows);
                    connection.release();
                });
            });
        });
    }
};