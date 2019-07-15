const request = require('request');
const cheerio = require('cheerio');

const newsSiteUrl = 'https://iz.ru/';

request(newsSiteUrl, (err, response, body) => {
    if(!err && response.statusCode === 200) {
        const $ = cheerio.load(body);
        console.log('Последние новости: ');
        const newsCount = $('.short-last-news__inside__list__item__label').length;

        for(i = 0; i < newsCount; i++) {
            const time = $('.short-last-news__inside__list__item__time').eq(i).text().trim();
            const newsText = $('.short-last-news__inside__list__item__label').eq(i).text().trim();
                        console.log(time + ` : ` + newsText);
        };

    }
});
