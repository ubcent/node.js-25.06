const request = require('request');
const cheerio = require('cheerio');

function getNews(url) {
    return new Promise((resolve, reject) => {
            request(url, (err, response, html) => {
                if(!err && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    var postArray = [];
                    var hrefArray = [];
                    var resultObj = {};
                    $('.post__title_link').each((index, item) => {
                        postArray.push($(item).text());
                        hrefArray.push($(item).attr('href'));
                    });
                    resultObj['news'] = postArray;
                    resultObj['href'] = hrefArray;
                    resolve(resultObj);
                } else {
                    throw err;
                }
            });
    })
}

function getOneNews(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, response, html) => {
            if(!err && response.statusCode === 200) {
                const $ = cheerio.load(html);
                let temp = $('.post__text').text();
                resolve(temp);
                reject(err);
            } else {
                throw err;
            }
        });
    })
}

exports.getOneNews = getOneNews;
exports.getNews = getNews;


