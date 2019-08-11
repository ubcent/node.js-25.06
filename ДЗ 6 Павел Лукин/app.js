const express = require('express');
const path = require('path');
const consolidate = require('consolidate');
const app = express();
const db = require('./db');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');

app.use(cookieSession({
    name: 'session',
    keys: ['key1'],
    maxAge: 24 * 60 * 60 * 1000
}));

express()
    .use(cookieParser('optional secret string'))
    .use(function(req, res, next){
        res.end(JSON.stringify(req.cookies));
    }
)

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(require('body-parser'). urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static(
    path.resolve(__dirname, 'public'),
));

const auth = require('./lib/auth.js')(app, {
	baseUrl: process.env.BASE_URL,
	providers: credentials.authProviders,
	successRedirect: '/account',
	failureRedirect: '/unauthorized',
});
auth.init();
auth.registerRoutes();

const User = require('./controllers/user-controller');

app.get('/register',  (req, res) => {
     res.render('register');
});
app.post('/register',  User.register);
app.get('/logout', User.logout);

app.get('/', User.index);
app.get('/update/:id/:name', (req, res) => {
    res.render('edit', {id: req.params.id, name: req.params.name});
});
app.post('/update', User.update);

app.get('/delete/:id', User.delete);

app.get('/add',  (req, res) => {
    res.render('add', {id: req.params.id, name: req.params.name});
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