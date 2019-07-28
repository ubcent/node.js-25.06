const express = require('express');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const consolidate = require('consolidate');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('news');
});
app.post('/', (req, res) => {
  let url = '';

  switch (req.body.type) {
    case 'politics':
      url = 'https://news.mail.ru/politics/';
      break;
    case 'society':
      url = 'https://news.mail.ru/society/';
      break;
    case 'sport':
      url = 'https://sportmail.ru/';
      break;
  }
  try {
    request(url, (err, response, html) => {
      if (!err && response.statusCode === 200) {
        const list = [];
        const $ = cheerio.load(html);

        for (let i = 0; i < req.body.qty; i++) {
          list.push($('.photo__title').eq(i).text().trim());
        }
        res.render('news', {list, url: url});
      }
    });
  } catch (e) {alert('Ошибка получения контента')}


});
app.listen(8888);