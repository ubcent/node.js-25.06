const request = require('request');
const cheerio = require('cheerio');

request('https://yandex.ru', (err, response, html) => {
    if(!err && response.statusCode === 200) {
        const $ = cheerio.load(html);
        $('.news__item-content').each((index, item) => {
            console.log(`${index}. ${$(item).text()}`);
        });
    } else {
        throw err;
    }
});

