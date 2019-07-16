(function () {

    //Задание 1 Функция будет брать текущий заголовок с сайта vedomosti.ru
    let request = require('request');
    let cheerio = require('cheerio');
    request('https://www.vedomosti.ru/', (err, response, html) => {
        if(!err && response.statusCode === 200) {
            const $ = cheerio.load(html);

            console.log('Новость дня:', $('.b-news__item__title a').text().trim());
        }
    });


})();