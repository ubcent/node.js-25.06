const path = require('path');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const Task = require('./model/taskMongo.js');
const User = require('./model/user');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const SECRET = 'very super puper secret';

router.use(cors());
router.use(express.json());
router.use(express.static(path.join(__dirname, 'public')));

// Идентификация
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

router.use('/getalltasks', checkToken);

router.get('/getalltasks', async (req, res) => {
    const alltasks = await Task.find().lean();
    alltasks.forEach((item) => {
        item['updated'] = moment(item['updated']).format("HH:mm:ss YYYY-MM-DD");
    });
    res.json(alltasks);
});

router.post('/addtask', (req, res) => {
    const findTask = new Promise((resolve, reject) => {
        resolve(Task.find().limit(1).sort({$natural:-1}));
        reject('Error. Oops');
    });
    findTask.then((data) => {
        return (data[0]['num'])
    })
        .then((result) => {
            let obj = req.body;
            obj['num'] = ++result;
            const task = new Task(obj);
            return (task.save());
        })
        .then((output) => {
            res.json(output);
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post('/deletetask', async (req, res) => {
    const task = await Task.deleteMany({"num" : { $in: req.body}});
    res.json(task);
});

router.get('/register', (req, res) => {
    if(req.user) {
        console.log(req.user);
        return res.redirect('http://localhost:8888/todomongo/getalltasks');
    }
    res.render('register');
});

// Аутентификация
router.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({email: username});
    if(!user) {
        return res.json({ result: 'failure', message: 'Unexpected credentials' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid) {
        return res.json({ result: 'failure', message: 'Unexpected credentials' });
    }
    const identity = {
        id: user._id,
        email: user.email,
    };
    const token = jwt.sign(identity, SECRET);

    res.json({ result: 'success', token });
});

router.post('/register', async (req, res) => {
    const candidate = await User.findOne({ email: req.body.email });
    if(!candidate) {
        const user = new User(req.body);
        const savedUser = await user.save();
        return res.json({ result: 'success' });
    }
    res.json({ result: 'failure' });
});

module.exports = router;