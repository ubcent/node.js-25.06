require('dotenv').config();
const express = require('express');
const fetch = require('isomorphic-fetch');
const app = express();
const KEY = process.env.TRANSLATE_API_KEY;
const PORT = 8000;

const getRequestUrl = text => (
  `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${KEY}&text=${text}&lang=en-ru`
);

app.get('/', (req, res) => {
  console.log(`Request from: ${req.hostname}, IP: ${req.ip}`);

  const { text } = req.query;

  if (!text) res.end();

  res.set({ 'content-type': 'text/plain; charset=utf-8' });

  const requestUrl = getRequestUrl(text);

  fetch(requestUrl)
    .then(responce => {
      if (responce.status !== 200) throw new Error('Bad response from yandex translate');

      return responce.json();
    })
    .then(json => {
      const translated = json.text.join(' ');
      res.end(translated);
    })
    .catch(err => {
      console.error(err);
      res.end();
    });
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

