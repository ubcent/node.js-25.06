const express = require('express');
const translate = require('yandex-translate')('trnsl.1.1.20190715T222644Z.22d479b4590e609f.cafb43dfb84faf96f18aef07ba49a001ab39b2e1');
const port = 8008;
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/',(request, response) => {
      console.log(request.url);
    request.url = request.url.substr(7).replace(/%3F/g, "?");
    translate.translate(request.url, { to: 'ru' }, function(err, res) {
        response.send(res.text);
    });

});

const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});



