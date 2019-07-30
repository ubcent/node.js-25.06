const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema ({
    taskName: { type: String},
    taskData: { type: String},
    taskStatus: {type: String},
    taskDeleted: {type: Boolean},
    taskCreatedTime: {type: String},
    userId: {type: String},
});

module.exports = mongoose.model('Task', taskSchema, 'tasks');