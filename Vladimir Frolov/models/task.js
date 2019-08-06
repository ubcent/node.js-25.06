const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { type: String },
    status: { type: String, default: 'uncompleted' },
    created: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Task', taskSchema, 'tasks');