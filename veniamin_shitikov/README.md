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

# Урок 4

Парсер цитат с сайта `bash.im`.
Запуск `node src/server.js`.

# Урок 5

ToDo list с использованием  mongodb.
В корневой папке есть файл .env
Там необходимо прописать настройки подключения к базе mongodb
```
DB_HOST=[ip_adress]
DB_NAME=[database_name]
DB_PORT=[database_port]
```
Также в этом файле можно указать порт, на котором будет работать сервер.
```
APP_PORT=[server_port]
```

Запуск `node src/server.js`.

