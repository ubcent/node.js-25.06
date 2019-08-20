const path = require('path');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const Task = require('./model/taskMongo.js');
const User = require('./model/user');
const passport = require('./passport');


router.use(passport.initialize);
router.use(passport.session);
router.use('/getalltasks', passport.checkAuthenticated);

router.use(express.static(path.join(__dirname, 'public')));

router.get('/getalltasks', async (req, res) => {
    const alltasks = await Task.find().lean();
    alltasks.forEach((item) => {
       item['updated'] = moment(item['updated']).format("HH:mm:ss YYYY-MM-DD");
    });
    res.render('listTasks', {list: alltasks} );
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
                res.redirect('http://localhost:8888/todomysql/getalltasks');
            })
            .catch((err) => {
                console.log(err);
            });
});


router.post('/deletetask', async (req, res) => {
    await Task.deleteMany({"num" : { $in: req.body}});
    res.redirect('http://localhost:8888/todomongo/getalltasks');
});

router.post('/updatetasks', async (req, res) => {
    const updatedTasks = await Task.updateOne({"num" : { $eq: req.body[0][1]}}, {"status": req.body[0][0]});
    res.redirect('http://localhost:8888/todomongo/getalltasks');
});

router.get('/register', (req, res) => {
    if(req.user) {
     console.log(req.user);
     return res.redirect('http://localhost:8888/todomongo/getalltasks');
    }
    res.render('register');
});

router.post('/register', async (req, res) => {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.redirect('http://localhost:8888/todomongo/getalltasks');
});

router.get('/auth', (req, res) => {
    if(req.user) {
     return res.redirect('http://localhost:8888/todomongo/getalltasks');
    }
    res.render('auth', { error: !! req.query.error });
});

router.post('/auth', passport.authHandler);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:8888/todomongo/auth');
});

module.exports = router;
