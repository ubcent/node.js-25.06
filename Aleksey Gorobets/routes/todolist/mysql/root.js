const express = require('express');
const Task = require('./task');
const router = express.Router();

router.use('/', async (req, res) => {
    const task = await Task.getAll();
    //const taskById = await Task.getById(2);
    //const insertTask = [5, 'test5', 'test55555', 'in_progress'];
    //const insertIdTask = await Task.insertTask(insertTask);
    res.send(task);
});

module.exports = router;
