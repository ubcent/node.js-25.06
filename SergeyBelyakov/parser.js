const request = require('request');
const cheerio = require('cheerio');

request('https://www.vl.ru', (err, response, html) => {
    if(!err && response.statusCode === 200) {
        const $ = cheerio.load(html);
        console.log(`${$('.news__main-post-title').text().trim()}`);

        const latestPost = $('.news__latest-post-link');
        latestPost.each((i) => {
            console.log(latestPost.eq(i).text());
        });
    }
});