const request = require('request');
const cheerio = require ('cheerio');
request('https://yandex.ru/', (err, response, html) => {
  if (!err && response.statusCode === 200) {
    const $ = cheerio.load(html);
    for (let i = 0; i < 5; i++) {
      console.log($('.news__item-content').eq(i).text().trim());
    }
  }
});
