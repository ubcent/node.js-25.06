const express = require('express');
const mysql = require('mysql');
const path = require('path');
const consolidate = require('consolidate');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

const db = mysql.createPool({
  host: 'localhost',
  database: 'to_do_list',
  user: 'root',
  password: 'jukjuk'
});

app.get('/', (req, res) => {
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
        res.render('list', arr);
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
    res.send(data)
  });
});

app.listen(8888);
