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

router.post('/updatetasks', async (req, res) => {
    const updatedTasks = await Task.updateTask(req.body);
    res.send(updatedTasks);
});

router.post('/addtask', async (req, res) => {
    console.log(req.body);
    const addedTask = await Task.insertNewTask(req.body);
    res.send(addedTask);
});

module.exports = router;
