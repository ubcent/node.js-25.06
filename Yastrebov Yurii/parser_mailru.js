const request = require('request');
const cheerio = require ('cheerio');
request('https://yandex.ru/', (err, response, html) => {
  if (!err && response.statusCode === 200) {
    const $ = cheerio.load(html);
    console.log($('.news__item-content').eq(0).text().trim());
  }
});