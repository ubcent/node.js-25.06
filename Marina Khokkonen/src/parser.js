/*1) Создать на основе express и handlebars веб-сервис с HTML-
интерфейсом для динамической загрузки информации с одного из
нескольких сайтов в выбранном формате. Зайдя на этот сервис,
пользователь сможет с помощью формы настроить параметры
информационной подборки (например, количество отображаемых
новостей или их категорию) и получить ее в удобном виде. Форма
должна отправляться на сервер методом POST.
)
2) Реализовать запоминание с помощью cookie текущих настроек
формы и при заходе на сайт показывать последние использованные
настройки. Если cookie не существует, можно при отображении
формы дополнительно учитывать передаваемые GET-запросы
(например, ?count=10&lang=ru и т.д.)*/
const path = require('path');
const util = require('util');
const request = require('request');
const cheerio = require('cheerio');
const consolidate = require('consolidate');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('views', __dirname + '/public');
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use((req, res, next)=>{
    session({
        tagNews: 'html',
    });
    next();
});
app.get('/', function (req, res)
{
    //console.log(req.session.tagNews);
    res.render('index');
});

app.post('/news', urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
    let news = [];
    let countNews = 0;
    request(`https://tproger.ru/tag/${req.body.tagNews}/`, (err, response, html) => {
        if (err) {
            console.log('Не удалось получить страницу: ', err);
        }
        else if (!err && response.statusCode === 200) {
            const $ = cheerio.load(html), posts = $('.post-text');
            posts.each(function (i, elem) {
                if (countNews < req.body.countNews) {
                    news.push({
                        'id': i + 1,
                        'title': $(this).find('.entry-title').text(),
                        'content': $(this).find('.entry-content p').text()
                    });
                }
                countNews++;
            });
        }
        else console.log('Ошибка');
        res.render('news', {news:news});
    });
});

app.listen(8888);