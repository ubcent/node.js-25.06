const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  title: {type: String},
  description: {type: String},
  status: {type: String, default: 'Not started'},
  update: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Task', todoSchema, 'tasks');
