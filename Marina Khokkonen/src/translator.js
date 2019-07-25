/*Создать переводчик слов с английского на русский, который будет
обрабатывать входящие GET запросы и возвращать ответы, полученные через API Яндекс.Переводчика.*/

const request = require("request");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Выберите слово, которое хотите перевести: ", (word) => {
    request(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190715T115323Z.de999f2538b45f57.1249c05147e9388605de04896171da63f9001072&lang=en-ru&text=${word}`,
        (err, response, html) => {
            if (err) {
                console.log("Не удалось получить еревод: ", err);
            }
            else if (!err && response.statusCode === 200) {
                const translate = JSON.parse(html);
                console.log(translate.text[0]);
            }
            else console.log("Ошибка");
    });
    rl.close();
});