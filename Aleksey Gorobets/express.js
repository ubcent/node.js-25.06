const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const consolidate = require('consolidate');
const habrRoute = require('./routes/habr');
const todoMysql = require('./routes/todolist/mysql/root');


const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));

app.use('/habr', habrRoute);
app.use('/todomysql', todoMysql);

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {name: 'Error'};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(8888);