const express = require('express')
const app =  express()
const request = require('request')
const cheerio = require('cheerio')
const path = require('path')
const templating = require('consolidate')

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.engine('hbs', templating.handlebars)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    const news = []
    let $
    if( req.body.url === 'Habr') {
        request('https://habr.com/ru/', function(err, response, body) {
            if (!err && response.statusCode == 200) {
                $ = cheerio.load(body)
                let time, head, prew
                $('article.post.post_preview').each(function(i, el) {
                    if(i < req.body.count){
                        time = $(this).find('span.post__time').text()
                        head = $(this).find('a.post__title_link').text()
                        prew = $(this).find('div.js-mediator-article').text()
                        news.push({time, head, prew})
                    }    
                })
                res.render('index', { 
                    news,
                    url: req.body.url,
                    count: req.body.count
                } )
            } else console.log(response.statusCode)
        })
           
    } else if (req.body.url === 'Yandex') {
        request('https://yandex.ru', function(err, response, body) {
            if (!err && response.statusCode == 200) {
                $ = cheerio.load(body)

                $('.news__item-content').each((i, el ) => {
                    
                    if(i < req.body.count) news.push({head: $(el).text()})
    
                })
                res.render('index', { 
                    news,
                    url: req.body.url,
                    count: req.body.count
                } )       
            }
        })    
    }
    
})

app.listen(3000, () => {
    console.log(`Server is on port 3000`)
})