## Домашние задания к курсу по `node.js`

# Урок 2

Сборка `npm run build`

После этого появится папка `build`. 

`node build/index.js` - запуск игры ОРЕЛ и РЕШКА.

Файл `build/game.log` - файл логов.

`node build/logParser.js PATH_TO_LOG_FILE` - запуск парсера логов.

# Урок 3

Парсер цитат с сайта `bash.im`.
Выводит в консоль лучшие цитаты.
Запуск `node src/bashNewsParser.js`.

Простой сервер переводчик.
Принимает get-запросы на порту 8000.
Запрос в формате `http://localhost:8000/?text=<TEXT_FOR_TRANSLATION>`.
Направляет запрос на API yandex переводчика и возвращает перевод клиенту.
Запуск `node src/translate.js`.



