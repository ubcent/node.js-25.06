const request = require('request');
const cheerio = require('cheerio');

request('https://www.rbc.ru/', (err, response, html) => {
  
  if(!err && response.statusCode === 200) {
    const $ = cheerio.load(html);

    let mainNews = $('.main__big').eq(0).text().trim() + '\n';
    console.log(mainNews);
    for(let i = 0; i < 14; i++) {       
      let newsText = $('.main__feed').eq(i).text().trim() + '\n';
      console.log(newsText);    
    }
  }   
});