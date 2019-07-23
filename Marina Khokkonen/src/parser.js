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
const request = require('request');
const cheerio = require('cheerio');
const consolidate = require('consolidate');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const tagTypes = [
                    {tag: 'html', selected: false},
                    {tag: 'css', selected: false},
                    {tag: 'javascript', selected: false},
                    {tag: 'react', selected: false},
                    {tag: 'node-js', selected: false},
                 ];

app.set('views', __dirname + '/public');
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.json());
app.use(cookieParser());

const setTypesArray = ( tag ) => {
    tagTypes.forEach( el => el.selected = false);
    tagTypes[tagTypes.findIndex(x => x.tag === tag)].selected = true;
};

app.get('/', function (req, res)
{
    res.cookie('tagNews' , ( (typeof req.body.tagNews) !== 'undefined' ? req.body.tagNews : ((typeof req.cookies.tagNews) !== 'undefined' ? req.cookies.tagNews :'html')));
    res.cookie('countNews' , (req.body.countNews > 0 ? req.body.countNews : ((typeof req.cookies.countNews) !== 'undefined' ? req.cookies.countNews :5)));
    setTypesArray( req.cookies.tagNews);
    res.render('index',{countNews: req.cookies.countNews, tagTypes});
});

app.post('/news', urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(404);
    res.cookie('tagNews' , req.body.tagNews);
    res.cookie('countNews' , req.body.countNews);
    let news = [];
    let countNews = 0;
    request(`https://tproger.ru/tag/${req.body.tagNews}/`, (err, response, html) => {
        if (err) {
            res.send('Не удалось получить новости: ', err);
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
            res.render('news', {news:news});
        }
        else res.sendStatus(404);
    });
});

app.listen(8888);