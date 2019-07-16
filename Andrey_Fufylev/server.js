const express = require('express');
const app = express();
const request = require('request');

app.use(express.json());
app.use('/', express.static('./public'));

app.get('/api/translate/:text', (req, res) => {
    request(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190713T090512Z.3c74ed3e9b64c829.de140b6786200196780918b82cb61160dc7bdc7b&text=${ req.params.text }&lang=en-ru`, (err, response) => {
        if ( !err && res.statusCode === 200 ) {
            let translation = JSON.parse(response.body);
            res.send(translation);
            //res.send(translation.text[ 0 ]);
        } else {
            res.sendStatus(404, JSON.stringify({ result: 'error', text: err }));
        }
    });
});

app.listen(3000, () => console.log('Listen on port 3000...'));