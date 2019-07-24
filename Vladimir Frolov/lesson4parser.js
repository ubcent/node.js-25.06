//Require libraries
const express = require('express');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

const consolidate = require('consolidate');
//const bodyParser = require('body-parser');

//Initiate app
const app = express();

//Initiate handlebars as part of consolidate
app.engine('hbs', consolidate.handlebars);
//Use .hbs files
app.set('view engine', 'hbs');
//find views file
app.set('views', path.resolve(__dirname, 'views'));

// до express@4 body-parser
app.use(express.urlencoded({
    extended: true
}));


app.get('/', (req, res) => {
    res.render('news');
});
app.post('/', (req, res) => {
    let url;
    switch (req.body.type) {
        case '1':
            url = 'https://www.vedomosti.ru/rubrics/economics';
            break;
        case '2':
            url = 'https://www.vedomosti.ru/rubrics/finance';
            break;
        case '3':
            url = 'https://www.vedomosti.ru/rubrics/technology';
            break;
    }
    try {
        request(url, (err, response, html) => {
            try {

                if (!err && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    res.render('news', {text: $('.b-news__item:first-child .b-news__item__title a').text().trim()});
                } else {
                    res.render('news', {error: 'Ошибка получения данных1'});
                }
            } catch (e) {
                res.render('news', {error: 'Ошибка получения данных: ' + e});
            }
        });
    } catch (e) {
        res.render('news', {error: 'Ошибка получения данных: ' + e});
    }

});


//Listen port 8888
app.listen(8888);


