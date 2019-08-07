const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const consolidate = require('consolidate');
const session = require('express-session');
const favicon = require('serve-favicon');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const habrRoute = require('./routes/habr');
const todoMysql = require('./routes/todolist/mysql/root');
const todoMongo = require('./routes/todolist/mongo/root');

mongoose.connect('mongodb://10.30.1.59:27017/todo', { useNewUrlParser: true, useFindAndModify: false }, (err) => {
    if(err) throw err;
    console.log('Successfully connected to mongoDB');
} );

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'super 12345 secret variable',  // используется для генерации
    resave: true, // перезапись сессии
    saveUninitialized: false,  // не сохранять пустые объекты, при заходе ботов например
    store: new MongoStore({ mongooseConnection:  mongoose.connection }),
}));

app.use(express.static(path.join(__dirname, 'static')));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use('/', (req, res, next) => {
    let views = req.session.view || 0;
    req.session.view = ++views;
    next();
    //console.log(req.session.view);
    //res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/habr', habrRoute);
app.use('/todomysql', todoMysql);
app.use('/todomongo', todoMongo);

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