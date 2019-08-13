const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/todolist', {useNewUrlParser: true});

const User = require('./models/user');
const Task = require('./models/tasks');
const passport = require('./passport');

const SECRET = 'awesome big huge super secret';


app.use(session({
    secret: 'my super secret phrase 123',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(cors());
app.use(express.json());
app.use(express.static( './static/' ));

app.use(passport.initialize);
app.use(passport.session);

const checkToken = async (req, res, next) => {
    if(req.headers.authorization) {
        const [type, token] = req.headers.authorization.split(' ');

        jwt.verify(token, SECRET, (err, payload) => {
            if(err) {
                return res.status(401).json({ message: 'Wrong token' });
            }

            req.user = payload;
            next();
        });
    } else {
        res.status(401).json({ message: 'No token present' });
    }
};

app.use('/todo', checkToken);

const newUser = {
    async addUser(newUser) {
    let user = new User(newUser);
    user = await user.save();
    return user._id;
    },
};

app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const user = await User.findOne({login: login});

    if(!user) {
        return res.json({ result: 'failure', message: 'Unexpected credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid) {
        return res.json({ result: 'failure', message: 'Unexpected credentials' });
    }

    if(user.banned) {
        return res.json({result: 'failure', message: 'User is banned.'})
    }

    const identity = {
        id: user._id,
    };

    const token = jwt.sign(identity, SECRET);

    res.json({ result: 'success', token });

});

app.get('/register', async (req, res) => {
        return res.redirect('/register.html');
});

app.get('/login', async (req, res) => {
    return res.redirect('/index.html');
});

app.post('/register', async (request, response) => {
    const req = request.body.params;
    if(req.password !== req.password2) {
        return response.json({msg: 'пароли не совпадают'});
    }
    const exists = await User.findOne({login: req.login});
    if (exists) {
        response.json({msg:`Пользователь ${req.login} уже зарегистрован!`});
    } else {
        if(req.login && req.password ) {
            await newUser.addUser(req);
            response.json({msg: 'ok'});
        } else response.json({msg: 'error'});
    }
});

//REST API begin
app.get('/todo', async (request, response) => {
    const userid = request.user.id;
    if(userid) {
        const data = await Task.find({userId: userid, taskDeleted: false}).lean();
        response.json(data);
    }
});

app.patch('/todo/:taskid', async (request, response) => {
    const id = request.params.taskid;
    const data = await Task.findByIdAndUpdate(id, { $set: request.body }, {useFindAndModify: false});
    response.json(data);
});

app.post('/todo/', async (request, response) => {
    const req = request.body.params;
    req.userId = request.user.id;
      if(req.taskName || req.taskData) {
        let newTask = await Task(req);
        await newTask.save();
        response.json({status: 'ok'});
    } else response.json({status: 'error'});
});

app.delete('/todo/:taskid', async (request, response) => {
    const id = request.params.taskid;
    const data = await Task.updateOne({_id: id}, {taskDeleted: true});
    response.json({status: 'ok'});
    });
//REST API end

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/index.html');
});

app.listen(8008);