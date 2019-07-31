const db = require('../db');
const BaseModel = require('./base-model');

class User extends BaseModel {
    constructor() {
        super();
        this.tbName = 'users';
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS ${this.tbName} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`, (runResult, err) => {
                if(err) {
                    console.log(err);
                    return;
                }
            });
        });
    }

    async list(callback) {
        let sql = `SELECT id, name FROM ${this.tbName} ORDER BY id`;
        await db.all(sql, [], (err, rows) => {
            if(err) {
                console.log(err);
                callback(false);
            }
            callback(rows);
        });
    }

    async get(id, callback) {
        let sql = `SELECT id, name FROM ${this.tbName} WHERE id = ?`;
        await db.get(sql, [id], (err, row) => {
            if(err) {
                console.log(err);
                callback(false);
            }
            callback(row);
        });
        //db.close();
    }

    async add(user, callback) {
        let sql = `INSERT INTO ${this.tbName} VALUES(?, ?)`;
        await db.run(sql, [, user.name], (err) => {
            if(err) {
                console.log(err);
                callback(false);
            }
            callback(true);
        });
    }

    async update(id, newName, callback) {
        let sql = `UPDATE ${this.tbName} SET name = ? WHERE id = ?`;
        db.run(sql, [newName, id], (err) => {
            if(err) {
                console.log(err);
                callback(false);
            }
        });
        callback(true);
    }

    async delete(id, callback) {
        let sql = `DELETE FROM ${this.tbName} WHERE id = ?`;
        await db.run(sql, id, (err) => {
            if(err) {
                console.log(err);
                callback(false);
            }
        });
        callback(true);
    }
}

module.exports = User;