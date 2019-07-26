const express = require('express');
const Task = require('./task');
const router = express.Router();

router.use('/', async (req, res) => {
    const task = await Task.getAll();
   // const task = 'mysql';
    res.send(task);
});

module.exports = router;