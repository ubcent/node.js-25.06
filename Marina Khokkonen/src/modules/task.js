const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { type: String },
    description : { type: String, default : ''},
    status: { type: String, default: 'not_started'},
    updated: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Task', taskSchema, 'tasks');