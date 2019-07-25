const request = require('request');
const cheerio = require('cheerio');

request('https://lenta.ru', function(error, response, html) {
    if(!error && response.statusCode == 200) {
        let $ = cheerio.load(html);
        let cols = $('.b-yellow-box__wrap').find('div');
		
        for(let i = 1; i < cols.length; i++) {
            console.log('%s', $(cols[i]).text());
            console.log('');
        }
    }
});