const request = require('request');
const readline = require('readline');
const apiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=';
const apiKey = 'trnsl.1.1.20190714T134850Z.77464a1221a74ec9.1f400a7506895acee1103512c5cbbae65f3c727b';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', line => {
  const url = apiUrl + apiKey + '&text=' + encodeURIComponent(line) + '&lang=en-ru';
  request(url, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      console.log(JSON.parse(body).text[0]);
    } else {
      console.log(err);
    }
  });
}).on('close',function(){
  process.exit(0);
});
