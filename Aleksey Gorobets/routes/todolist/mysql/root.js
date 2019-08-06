const express = require('express');
const path = require('path');
const Task = require('./task');
const router = express.Router();

router.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

router.get('/getalltasks', async (req, res) => {
    const allTasks = await Task.getAll();
    res.render('listTasks', allTasks);
});

router.post('/deletetask', async (req, res) => {
    const deletedTasks = await Task.deleteTask(req.body);
    res.send(deletedTasks);
});

router.post('/updatetasks', (req, res) => {
    const promise = new Promise((resolve, reject) => {
        const updatedTasks = Task.updateTask(req.body);
        resolve(updatedTasks);
        reject(new Error('Oops, Error!'));
    });
    promise
        .then((result) => {
            let allTask = Task.getAll();
            return allTask;
        })
        .then((data) => {
            res.render('listTasks', data);
        })
        .catch((error) => {
            console.log(error);
        });
});

router.post('/addtask', async (req, res) => {
    console.log(req.body);
    const addedTask = await Task.insertNewTask(req.body);
    res.send(addedTask);
});

module.exports = router;
