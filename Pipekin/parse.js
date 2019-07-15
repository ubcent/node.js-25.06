const request = require('request')
const cheerio = require('cheerio')

request('https://habr.com/ru/', function(err, response, body) {
    if (!err && response.statusCode == 200) {
        const $ = cheerio.load(body)
        let time, head, prew
        $('article.post.post_preview').each(function(i, el) {
          if(i<5){
            time = $(this).find('span.post__time').text()
            head = $(this).find('a.post__title_link').text()
            prew = $(this).find('div.js-mediator-article').text()
            console.log(`${time}\n ${head}\n ${prew}\n`)
          }
        })
        
    }
})