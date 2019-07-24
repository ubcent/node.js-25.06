const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const cookieParser = require('cookie-parser');
const request = require('request');

const newsParser = require('./newsParser');

const app = express();

const PORT = 8000;

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  const { category, count } = req.body;
  res.cookie('category', category);
  res.cookie('count', count);
  res.redirect(302, '/');
});

app.get('/', (req, res) => {
  const { category, count = 3 } = req.cookies;

  const POST_URL = `https://bash.im${category}`;

  request(POST_URL, (err, responce, body) => {
    let posts = '';

    if (!err && responce.statusCode === 200) {
      posts = newsParser(body).slice(0, +count).join('<hr/>');
    }

    res.render('index', { posts });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
