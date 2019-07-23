const request = require('request-promise');
const cheerio = require('cheerio');
const express = require('express');
const path = require('path');
const consolidate = require('consolidate');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'templates'));

const newsId = {
    keys: [],
};

const news = {
    'iz': {
        portalName: 'IZ.RU',
        portalWww: 'https://iz.ru/',
        parseClass: '.short-last-news__inside__list__item__label',
        news: [],
        newsSliced : [],
        selected: {
            iz: "",
        },
    },
    'rbc': {
        portalName: 'RBC.RU',
        portalWww: 'https://www.rbc.ru/',
        parseClass: '.main__feed__title',
        news: [],
        newsSliced : [],
        selected: {
            rbc: ""
        },
    },
    'russrt': {
        portalName: 'RUSSIAN.RT.COM',
        portalWww: 'https://russian.rt.com/',
        parseClass: '.listing__column_main-news',
        news: [],
        newsSliced : [],
        selected: {
            russrt: "",
        },

    },
};

for (key in news) {
    newsId.keys.push(key);
};

app.use(express.json());
app.use(express.urlencoded());

app.get('/news/', (req, res) => {
    res.render('form', news[newsId.keys[0]]);
});

app.post('/news', (req, res) => {
    if (newsId.keys.indexOf(req.body.name) === -1 || req.body.count > 100
        || req.body.count < 0 || isNaN(req.body.count)) {
        console.log('Ошибка в параметрах запроса');
        res.send('Error: некорректные параметры запроса');
    } else {
        news[req.body.name].newsSliced = news[req.body.name].news.slice(0,req.body.count);
        news[req.body.name].selected[req.body.name] = 'selected';
        res.render('news', news[req.body.name]);
    };
});

for(let j = 0; j < newsId.keys.length; j++) {
    request(news[newsId.keys[j]].portalWww, (err, response, body) => {
            if(!err && response.statusCode === 200) {
                const $ = cheerio.load(body);
                const lastNews = $(news[newsId.keys[j]].parseClass);
                const newsCount = lastNews.length;
                for(let i = 0; i < newsCount; i++) {
                    const newsText = lastNews.eq(i).text().trim();
                    news[newsId.keys[j]].news.push(newsText);
                }
            } else console.log(err);
        });
};

setInterval(() => {
    console.log("Обновление новостей....");
    for(let j = 0; j < newsId.keys.length; j++) {
        request(news[newsId.keys[j]].portalWww, (err, response, body) => {
            if(!err && response.statusCode === 200) {
                const $ = cheerio.load(body);
                const lastNews = $(news[newsId.keys[j]].parseClass);
                const newsCount = lastNews.length;
                news[newsId.keys[j]].news = [];
                for(let i = 0; i < newsCount; i++) {
                    const newsText = lastNews.eq(i).text().trim();
                    news[newsId.keys[j]].news.push(newsText);
                }
            } else console.log(err);
        });
    };
    console.log("Обновление завершено.");
}, 100000);

app.listen(8008);