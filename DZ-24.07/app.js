const express = require('express');
const path = require('path');
const consolidate = require('consolidate');
const app = express();
const request = require('request');
const cheerio = require('cheerio');

let newsList = [];

request('https://lenta.ru', function(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var cols = $('.b-yellow-box__wrap').find('div');
        for(let i = 1; i < cols.length; i++) {
            let news = $(cols[i]).text();
            newsList.push(news);
        }
    }
});

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(require('body-parser'). urlencoded({ extended: true }));
app.use(express.json());

app.use(require('cookie-parser')('cookieSecretEFEfef744jff'));

let newsLength = "";

app.use((req, res, next) => {
    newsLength = 'максимально число новостей' + newsList.length;
    next();
  });

app.use('/static', express.static(
    path.resolve(__dirname, 'public'),
));

app.get('/', (req, res) => {
    const tmpcount = req.cookies.tmpcount;
    const lang = req.cookies.lang;
    if(tmpcount && lang) {
        res.render('index', {count: newsLength, tmpcount: tmpcount, lang: lang});
    } else {
        res.render('index', {count: newsLength});
    }
});

app.post('/myform', (req, res) => {
    const _countNews = req.body.countNews;
    if(_countNews > newsLength) {
        res.render('index', {count: 'число новостей не должно быть больше ' + newsLength});
    } else {
        let tmpList = [];
        for(let i = 0; i < _countNews; i++) {
            res.cookie('tmpcount', _countNews);
            res.cookie('lang', req.body.lang);
            tmpList.push(newsList[i]);
        }
        res.render('news', {newsList: tmpList});
    }
});

app.get('/replace/:tmpcount/:lang', (req, res) => {
    const tmpcount = req.params.tmpcount;
    const lang = req.params.lang;
    if(tmpcount && lang) {
        res.render('replace', {count: newsLength, tmpcount: tmpcount, lang: lang});
    }
});

app.listen(8888);