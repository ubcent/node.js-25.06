/*1) Создать на основе express и handlebars веб-сервис с HTML-
интерфейсом для динамической загрузки информации с одного из
нескольких сайтов в выбранном формате. Зайдя на этот сервис,
пользователь сможет с помощью формы настроить параметры
информационной подборки (например, количество отображаемых
новостей или их категорию) и получить ее в удобном виде. Форма
должна отправляться на сервер методом POST.*/

const server = require('express');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const consolidate = require('consolidate');
const app = server();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(server.json()); // for parsing application/json
app.use(server.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const links = {
    'rbc.ru': {
        'general': {
            sourceUrl: 'https://www.rbc.ru/',
            newsBlock: '.news-feed__item__title',
        },
        'auto': {
            sourceUrl: 'https://www.autonews.ru/',
            newsBlock: '.item-medium__title',
        },
        'sport': {
            sourceUrl: 'https://sportrbc.ru/',
            newsBlock: '.item-sport_medium',
        }
    },
    'bbc.com': {
        'general': {
            sourceUrl: 'https://www.bbc.com/news',
            newsBlock: '.nw-c-promo-summary',
        },
        'auto': {
            sourceUrl: 'https://www.bbc.com/news/business/global_car_industry',
            newsBlock: '.gs-c-promo-summary',
        },
        'sport': {
            sourceUrl: 'https://www.bbc.com/sport',
            newsBlock: '.sp-o-link-split__text',
        }
    },
    'rambler.ru': {
        'general': {
            sourceUrl: 'https://news.rambler.ru/',
            newsBlock: '.top-card__title',
        },
        'auto': {
            sourceUrl: 'https://auto.rambler.ru/',
            newsBlock: '.top-card__title',
        },
        'sport': {
            sourceUrl: 'https://sport.rambler.ru',
            newsBlock: '.top-card__title',
        }
    },
};

app.get('/', (req, res) => {
    res.render('form');
});
app.post('/news', (req, res) => {
    let source = req.body.source;
    let topic = req.body.topic;
    let sourceUrl = links[ source ][ topic ].sourceUrl;
    let newsBlock = links[ source ][ topic ].newsBlock;
    let news = {
        source: source,
        topic: topic,
        news: []
    };
    request(sourceUrl, (err, response, html) => {
        if ( !err && response.statusCode === 200 ) {
            const $ = cheerio.load(html);
            for ( let i = 0; i < $(newsBlock).length; i++ ) {
                news.news.push($(newsBlock).eq(i).text().trim())
            }
        }
        res.render('form', news);
    });
});

app.listen(8888);