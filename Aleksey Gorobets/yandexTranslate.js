const request = require('request');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log('Введите текст или слово: ');

rl.on('line', (line) => {
    //Сначала определяем язык введенного текста
    const detect = `https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20190713T085028Z.12dac74a9d704138.b4dcfdf499daae9f95ead7a7713bebaf18132588&text=${line}`;
    request(encodeURI(detect), (err, response, body) => {
        if(!err && response.statusCode === 200) {
            const langTrans = (JSON.parse(body).lang === 'ru') ? 'ru-en' : 'en-ru';
            //запрос на перевод
            const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190713T085028Z.12dac74a9d704138.b4dcfdf499daae9f95ead7a7713bebaf18132588&text=${line}&format=plain&lang=${langTrans}`;
            request(encodeURI(url), (err, response, body) => {
                if(!err && response.statusCode === 200) {
                    console.log('Перевод: %s', JSON.parse(body).text[0]);
                } else {
                    throw 'Error detect translate: ' + err;
                }
            });
        } else {
            throw 'Error detect lang: ' + err;
        }
    });
});