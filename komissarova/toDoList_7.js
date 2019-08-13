const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./models/db.js');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', express.static(path.resolve(__dirname, 'public')));

const SECRET = 'warum denn ja eigentlich nicht';

app.get('/isAuthorized', async (req, res) => {
  if (req.headers.authorization) { 
    const [type, token] = req.headers.authorization.split(' ');
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) { 
        return res.status(401).json({result: 'Wrong token'});
      }
      req.user = payload; 
      res.json({result: 'success'}); 
    });
  } else {
    res.status(401).json({result: 'No token present'});
  }
});

app.post('/register', (req, res) => {
  const {firstName, lastName, email, password} = req.body;
  const CRYPT_STEPS = 12;
  const hash = bcrypt.hashSync(password, CRYPT_STEPS);
  const newQuery = 'INSERT INTO to_do_list.users (user_first_name, user_last_name, user_email, user_password) VALUES (?, ?, ?, ?)';
  db.query(newQuery, [firstName, lastName, email, hash], function (err, data) {
    if (err) {
      console.error(err);
      res.json({result: err});
    } else {
      res.json({result: 'success'});
    }
  });
});

app.post('/auth', async (req, res) => {
  const {username, password} = req.body;
  if (username && password) {
    const line = 'SELECT * FROM to_do_list.users WHERE user_email = ?';
    await db.query(line, [username], (error, results, fields) => {
      if (results.length > 0) {
        const user = JSON.parse(JSON.stringify(results[0])); 
        if (bcrypt.compareSync(password, user.user_password)) { 
          const identity = { 
            id: user.user_id,
            email: user.user_email,
          };
          const token = jwt.sign(identity, SECRET); 
          res.json({result: 'success', token}); 
        } else {
          res.json({result: 'Incorrect Username and/or Password!'});
        }
      } else {
        res.json({result: 'Incorrect Username'});
      }
    });
  } else {
    res.json({result: 'Please enter Username and Password!'});
  }
});

const checkToken = async (req, res, next) => { 
  if (req.headers.authorization) { 
    const [type, token] = req.headers.authorization.split(' ');
    
    jwt.verify(token, SECRET, (err, payload) => { 
      if (err) { 
        return res.status(401).json({result: 'Wrong token'});
      }
      req.user = payload; 
      next(); 
    });
  } else {
    res.status(401).json({result: 'No token present'});
  }
};

app.use('/tasks', checkToken);

app.get('/tasks', async (req, res) => {
  await db.getConnection((err, connection) => {
    if (err) {
      res.json(err);
      console.log(err);
    }
    connection.query('SELECT * FROM to_do_list.tasks', (err, rows) => {
      if (!err) {
         res.json(rows);
        connection.release();
      } else {
        console.log(err);
      }
    })
  });
});

app.post('/tasks/addtask', (req, res) => {
  const description = req.body.newtask;
  const newQuery = 'INSERT INTO to_do_list.tasks (task_description) VALUES (?)';
  db.query(newQuery, [description], function (err, data) {
    if (err) {
      return console.log(err);
    } else {
      res.json({result: 'success'});
    }
  });
});

app.delete('/tasks/remove', async (req, res) => {
  const id = +req.body.id;
  const newQuery = 'DELETE FROM to_do_list.tasks WHERE task_id=?';
  await db.query(newQuery, [id], function (err, data) {
    if (err) {
      return console.log(err);
    } else {
       res.json({result: 'success'});
    }
  });
});

app.put('/tasks/update', (req, res) => {
  const {id, description} = req.body;
  const newQuery = 'UPDATE to_do_list.tasks SET task_description = ? WHERE task_id = ?';
  db.query(newQuery, [description, id], function (err, data) {
    if (err) {
      return console.log(err);
    } else {
      res.json({result: 'success'});
    }
  });
});

app.listen(8888);
