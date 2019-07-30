const mysql = require('mysql');
const moment = require('moment');

const pool = mysql.createPool({
    host: '10.30.1.59',
    database: 'todo',
    user: 'nodejs',
    password: '1qaz!QAZ',
    port: 3306,
    connectionLimit : 10,
    multipleStatements: true
});

module.exports = {
    getAll() {
        return new Promise((resolve, reject) => {
            const sql = mysql.format('select * from listTask;');
            pool.query(sql, (err, rows) => {
                if (err) {
                    reject('Error occurred ' + err);
                }
                const obj = {list: []};
                Object.keys(rows).forEach(function(key) {
                    obj['list'].push({id: rows[key].id, num: rows[key].num, title: rows[key].title, description: rows[key].description, status: rows[key].status, updated: moment(rows[key].updated).format("HH:mm:ss YYYY-MM-DD")});
                });
                resolve(obj);
            });
        });
    },
    getById(id) {
        return new Promise((resolve, reject) => {
            const sql = mysql.format('select * from listTask where num = ?;', [id]);
            pool.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    },
    insertNewTask(task) {
        return new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                const lasNum = mysql.format('select num from listTask order by num desc limit 1');
                pool.query(lasNum, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                })
            })
                .then((data) => {
                    const newNum = data[0]['num'] + 1;
                    task.unshift(newNum);
                    const sql = mysql.format('insert into listTask (num, title, description, status) values (?, ?, ?, ?)', task);
                    pool.query(sql, (err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(rows);
                    })
                })

        })
    },
    updateTask(task) {
        return new Promise((resolve, reject) => {
            var sql = '';
            task.forEach((item) => {
                sql = sql + mysql.format('update listTask set status=? where num = ?; ', item);
            });
            pool.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            })
        })
    },
    deleteTask(id) {
        return new Promise((resolve, reject) => {
            const sql = mysql.format('delete from listTask where num in (?);', [id]);
            pool.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    },
};

