const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/todo', {useNewUrlParser: true, useFindAndModify: true });