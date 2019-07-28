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
    //const id = req.body;
    const deletedTasks = await Task.deleteTask(req.body);
    res.send(deletedTasks);
});


//
// router.use('/', async (req, res) => {
//     //const task = await Task.getAll();
//     //const taskById = await Task.getById(2);
//     //const insertTask = [6, 'test6', 'test66666', 'in_progress'];
//     //const insertIdTask = await Task.insertNewTask(insertTask);
//     //const updatedtask = ['test7', 'test77777', 'completed', 6];
//     //const updatedTask = await Task.updateTask(updatedtask);
//     const deletedTask = await Task.deleteTask(5);
//     res.send(deletedTask);
// });

module.exports = router;
