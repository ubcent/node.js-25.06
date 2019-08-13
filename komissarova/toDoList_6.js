const express = require('express');
const path = require('path');
const consolidate = require('consolidate');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const db = require('./models/db.js');
const sessionStore = new MySQLStore({}, db);


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
  key: 'secrettt',
  secret: 'the_most_secret_secret_in_the_world',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', (req, res) => {
  return res.redirect('/home');
});

app.get('/tasks', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    }
    connection.query('SELECT * FROM to_do_list.tasks', (err, rows) => {
      if (!err) {
        const newRows = JSON.parse(JSON.stringify(rows));
        const arr = {
          task: newRows,
        };
        res.render('list_6', arr);
        connection.release();
      } else {
        console.log(err);
      }
    })
  });
});

app.post('/addtask', (req, res) => {
  const description = req.body.newtask;
  const newQuery = 'INSERT INTO to_do_list.tasks (task_description) VALUES (?)';
  db.query(newQuery, [description], function (err, data) {
    if (err) return console.log(err);
    res.redirect('/');
  });
});

app.delete('/remove', (req, res) => {
  const id = +req.body.id;
  const newQuery = 'DELETE FROM to_do_list.tasks WHERE task_id=?';
  db.query(newQuery, [id], function (err, data) {
    if (err) return console.log(err);
    res.send(data);
  });
});

app.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  const newQuery = 'SELECT * FROM to_do_list.tasks WHERE task_id=?';
  db.query(newQuery, [id], function (err, data) {
    if (err) return console.log(err);
    if (data.length > 0) {
      res.render('update', data[0]);
    }
  });
});

app.post('/update', (req, res) => {
  const id = req.body.id;
  const description = req.body.description;
  const newQuery = 'UPDATE to_do_list.tasks SET task_description = ? WHERE task_id = ?';
  db.query(newQuery, [description, id], function (err, data) {
    if (err) return console.log(err);
    res.redirect('/');
  });
});

app.get('/register/', async (req, res) => {
  res.render('register');
});

app.post('/register/', (req, res) => {
  const {firstName, lastName, email, password} = req.body;
  const CRYPT_STEPS = 12;
  const hash = bcrypt.hashSync(password, CRYPT_STEPS);
  const newQuery = 'INSERT INTO to_do_list.users (user_first_name, user_last_name, user_email, user_password) VALUES (?, ?, ?, ?)';
  db.query(newQuery, [firstName, lastName, email, hash], function (err, data) {
    if (err) return console.log(err);
    res.redirect('/');
  });
});

app.get('/auth', async (req, res) => {
  if (req.session.loggedin) {
    return res.redirect('/tasks');
  } else {
    res.render('auth');
  }
});

app.post('/auth', async (req, res) => {
  const {username, password} = req.body;
  if (username && password) {
    const line = 'SELECT * FROM to_do_list.users WHERE user_email = ?';
    await db.query(line, [username], (error, results, fields) => {
      if (results.length > 0) {
        const row = JSON.parse(JSON.stringify(results[0]));
        if (bcrypt.compareSync(password, row.user_password)) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('/home');
        } else {
          res.render('auth', {error: 'Incorrect Username and/or Password!'});
        }
      } else {
        res.render('auth', {error: 'Incorrect Username'});
      }
    });
  } else {
    res.render('auth', {error: 'Please enter Username and Password!'});
  }
});

app.get('/home', async (req, res) => {
  if (req.session.loggedin) {
    return res.redirect('/tasks');
  } else {
    return res.render('auth', {error: 'Enter login and password'});
  }
});

app.get('/logout', (req, res) => {
  req.session.loggedin = false;
  res.redirect('/auth');
});

app.listen(8888);
