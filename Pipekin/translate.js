const express = require('express')
const app = express()
const request = require('request')
const path = require('path')
const key = 'trnsl.1.1.20190714T204352Z.3dc398dee66dab8a.e354ea8063c8dfef51c283e362556ef915e2e632'

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/', (req, res) => {
    const text = req.body.text
    const uri = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${text}&lang=ru-en`
    request.post( encodeURI(uri),function (error, response, body) {
        if(!error & response.statusCode === 200)
           res.send( JSON.parse(body).text[0])
        else throw error
    }) 
})

app.listen(3000, () => {
    console.log(`Server is on port 3000`)
})