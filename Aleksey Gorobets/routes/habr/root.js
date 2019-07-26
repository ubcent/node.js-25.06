const express = require('express');
const path = require('path');
const news = require('./getNews');
const router = express.Router();

router.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

var obj = {};
router.get('/flow', (req, res) => {
    async function receiveNews() {
        const data = await news.getNews(`https://habr.com/ru/flows/${req.query.flowname}`);
        return data;
    }
    receiveNews()
        .then((data) => {
            obj = data;
            res.render('listNews', data);
        });
});

router.post('/getNews', (req, res) => {
    const num = obj['news'].indexOf(req.body.post);
    const link = obj['href'][num];
    async function receiveNews() {
        const data = await news.getOneNews(link);
        return data;
    }
    receiveNews()
        .then((data) => {
            if( req.body.len === 'full') {
                res.send(data);
            } else {
                res.send(data.slice(0, 1000));
            }
        });
});

module.exports = router;