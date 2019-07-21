const express = require('express');
const path = require('path');
const consolidate = require('consolidate');
const importParser = require('./myParserUpdated');
// const m = importParser.news;
// console.log(m);
const request = require('request');
// const cheerio = require('cheerio');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

// const titles = {
//     '1': {
//         description: 'Новости',
//         titles: [
//             'Переходи на тёмную сторону силы!',
//             'Ты недооцениваешь мою мощь!',
//             'Люк, я твой отец!!!',
//         ]
//     },
//     '2': {
//         description: 'Посты',
//         titles: [
//             'Джедаи - это круто!',
//         ]
//     }
// }
app.use(express.json());
app.get('/', (req, res) => {
    const url = 'https://www.rbc.ru/';
    request(url, (err, response, html) => {
        let news = '';
        if(!err && response.statusCode === 200) {
            news = news(html).eq(i).text().trim() + '\n';
        }
        res.render('titles', {news});
    });
    //titles[req.params.id]);
});

// app.get('/users', (req, res) => {
//     const user = {
//         firstName: 'Darth',
//         lastName: 'Vaider',
//     }
//     res.send(user);
// });

app.listen(8888);