const express = require('express');
const path = require('path');
const consolidate = require('consolidate');
const app = express();
const db = require('./db');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(require('body-parser'). urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static(
    path.resolve(__dirname, 'public'),
));

const User = require('./controllers/user-controller');

app.get('/', User.index);
app.get('/update/:id', (req, res) => {
    res.render('edit', {id: req.params.id});
});
app.post('/update', User.update);
app.get('/delete/:id', User.delete);
app.get('/add',  (req, res) => {
    res.render('add');
});
app.post('/add', User.add);

app.use(function(err, req, res, next) {
    db.close();
    console.error(err.stack);
    res.status(500).send('ERROR ' + 500);
});

app.listen(8888, () => {
    console.log('Example app listening on port 8888!');
});