const https = require('https');
const http = require('http');

const API_KEY = 'trnsl.1.1.20190713T145809Z.5cb4420a44cb4ec5.b76d297a933442b80f45dd10f89e0fe07b724d58';
const API_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

http.createServer((request, response) => {
    const text = decodeURI(request.url.slice(1));
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});

    if (text !== 'favicon.ico') {
        const promise = new Promise((resolve) => {
            https.get(`${API_URL}?key=${API_KEY}&text=${text}&lang=en-ru`, (res) => {
                res.on('data', (d) =>  resolve(JSON.parse(d).text));
            }).on('error', (err) => {
                console.log(err);
            });
        });
        promise
            .then((result) => {
                response.write(result.toString());
                response.end();
            })
            .catch((err) => {
                response.write(err);
                response.end();
            })
    }
}).listen(8888);