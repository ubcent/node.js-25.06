const mongoose = require('mongoose');
const { Schema } = mongoose;

const todosSchema = new Schema({
  done: { type: Boolean, default: false },
  text: { type: String },
});

module.exports = mongoose.model('Todos', todosSchema, 'todos');
