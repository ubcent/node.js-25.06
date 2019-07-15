const readline = require('readline');
const request = require('request');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Введите текст: ');

rl.on('line', (line) => {       
    request(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190714T160438Z.a6b423f5ef645bf6.428b7d44054e08df276029528eb61ff763be7a98&lang=en-ru&text=${line}`,
        (err, response, body) => {
            if (err) {
                console.log('Ошибка: ', err);
            } else if (!err && response.statusCode === 200) {
                let translate = JSON.parse(body);
                console.log('Перевод: ' + '\r\n' + translate.text[0]);
            } 
    });   
});  
    
