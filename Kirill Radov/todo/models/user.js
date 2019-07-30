const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    firstName: { type: String},
    lastName: { type: String},
    login: {type: String},
    password: {type: String},
    email: {type: String},
});

module.exports = mongoose.model('User', userSchema, 'users');