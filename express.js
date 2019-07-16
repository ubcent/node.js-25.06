const express = require('express');
const path = require('path');

const consolidate = require('consolidate');
// const bodyParser = require('body-parser');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

// до express@4 body-parser
// app.use(bodyParser.json());

app.use(express.json()); // во всех post-запросах появляется req.body
app.use('/static', express.static(
  path.resolve(__dirname, 'public'),
));

app.use((req, res, next) => {
  console.log('Middleware1');
  next();
});

app.use((req, res, next) => {
  console.log('Middleware2');
  req.user = {
    firstName: 'Darth',
    lastName: 'Vaider',
  };
  next();
});

app.all('/users/:id/:name', (req, res, next) => {
  console.log('All', req.user);
  next();
});

app.get('/users', (req, res) => {
  const user = {
    firstName: 'Darth',
    lastName: 'Vaider',
  }
  res.send(user);
});

app.get('/users/:id/:name', (req, res) => {
  console.log('Route', req.user);
  res.send(`User ID#${req.params.id} ${req.params.name}`);
});

app.post('/users', (req, res) => {
  console.log(req.body);

  res.send('OK');
});

const users = {
  '1': {
    firstName: 'Darth',
    lastName: 'Vaider',
    error: false,
    posts: [
      'Переходи на темную сторону силы!',
      'Ты недооцениваешь мою мощь!',
      'Люк, я твой отец!!!'
    ]
  },
  '2': {
    firstName: 'Luke',
    lastName: 'Skywalker',
    error: true,
    posts: [
      'Джедаи - это круто!',
    ]
  }
}

app.get('/users/:id', (req, res) => {
  res.render('user', users[req.params.id]);
});

app.listen(8888);