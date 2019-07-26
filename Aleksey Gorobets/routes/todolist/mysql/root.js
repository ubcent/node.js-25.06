const express = require('express');
const Task = require('./task');
const router = express.Router();

router.use('/', async (req, res) => {
    //const task = await Task.getAll();
    const taskById = await Task.getById(2);
    res.send(taskById);
});

module.exports = router;
