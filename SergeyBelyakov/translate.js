const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

const API_KEY = 'trnsl.1.1.20190713T145809Z.5cb4420a44cb4ec5.b76d297a933442b80f45dd10f89e0fe07b724d58';
const API_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

function translate(text) {
    https.get(`${API_URL}?key=${API_KEY}&text=${text}&lang=en-ru`, (res) => {
        res.on('data', (d) => console.log(JSON.parse(d).text[0]));
    }).on('error', (err) => {
        throw err;
    });
}

console.log('Что переводить? "q" для выхода');
rl.on('line', (line) => {
    if (line === 'q') {
        rl.close();
    } else {
        translate(line);
    }
});