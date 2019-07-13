const request = require('request');
const cheerio = require('cheerio');

request('https://www.rbc.ru/', (err, response, html) => {
  if(!err && response.statusCode === 200) {
    const $ = cheerio.load(html);
    
    console.log(`\nОСНОВНАЯ НОВОСТЬ:`);
    console.log(`${$('.main__big__title').text()}\n`);
    console.log(`Новостной блок:`);
    for (let i = 0; i<$('.news-feed__item__title').length; i++) {
      console.log(`${i+1}. ${$('.news-feed__item__title').eq(i).text().trim()}\n`);
    }
  }
});
