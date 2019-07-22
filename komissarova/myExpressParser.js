const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const path = require('path');
const consolidate = require('consolidate');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/news', (req, res) => {
  request('https://www.rbc.ru/', (err, response, html) => {
  
    if(!err && response.statusCode === 200) {
      const $ = cheerio.load(html);
      let newsArray = [];
      let mainNews = $('.main__big').eq(0).text().trim() + '\n';
      newsArray.push(mainNews);
      for(let i = 0; i < 14; i++) {       
        let newsText = $('.main__feed').eq(i).text().trim() + '\n';
        newsArray.push(newsText);        
      }     
      res.render('titles', {newsArray});           
    }    
  });
});

app.get('/posts', (req, res) => {
  request('https://tproger.ru/', (err, response, html) => {
  
    if(!err && response.statusCode === 200) {
      const $ = cheerio.load(html);
      let newsArray = [];
      let postsCount = $('.post-title').length;
      for(let i = 0; i < postsCount; i++) {
        let postsText = $('.post-title').eq(i).text().trim() + '\n';
        newsArray.push(postsText);
      }
      res.render('titles', {newsArray});
    }
  });
});

app.listen(8888);


