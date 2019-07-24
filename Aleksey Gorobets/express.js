const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const consolidate = require('consolidate');
const news = require('./getNews');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});
app.use(express.static(path.join(__dirname, 'public')));

var obj = {};
app.get('/flow', (req, res) => {
    async function receiveNews() {
        let data = await news.getNews(`https://habr.com/ru/flows/${req.query.flowname}`);
        return data;
    }
    receiveNews()
        .then((data) => {
            obj = data;
            res.render('listNews', data);
        });
});

app.post('/getNews', (req, res) => {
    let num = obj['news'].indexOf(req.body.post);
    var link = obj['href'][num];
    async function receiveNews() {
        let data = await news.getOneNews(link);
        return data;
    }
    receiveNews()
        .then((data) => {
            if( req.body.len === 'full') {
                res.send(data);
            } else {
                res.send(data.slice(0, 1000));
            }
        });
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