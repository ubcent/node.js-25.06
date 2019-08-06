const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    num: {type: Number },
    title: { type: String, default: 'not defined' },
    description: { type: String, default: 'not defined' },
    status: { type: String, default: 'not_started' },
    updated: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Task', taskSchema, 'tasks');

