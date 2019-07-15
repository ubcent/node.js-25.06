const input = require('input');
const request = require('request');
const cheerio = require('cheerio');
const key = 'trnsl.1.1.20190715T080920Z.324b0e6df24b6f7d.58a7291a9f3612d9f50215941a20c2aa8ae76824';
const lang = 'en-ru';
const format = 'plain';

async function translat() {
    const userText = await input.text('Bведи ка словечко англицкое!', {});
    if(userText && userText !== 'n') {
        await request(`https://translate.yandex.net/api/v1.5/tr/translate?key=${key}&text=${userText}&lang=${lang}&format=${format}`, 
        function(error, response, html){
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                console.log($('Translation').find('text').text());
                translat();
            }
        } );
    }else if(userText === 'n') {
        return true;
    }
     else {
        translat();
    }
}
translat();