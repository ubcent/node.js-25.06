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
    let obj = {
        list: []
    };
    //console.log(allTasks);
    // allTasks.forEach((item, i) => {
    //     console.log(item['RowDataPacket']);
    //     //alert( i + ": " + item + " (массив:" + arr + ")" );
    // });
//     let obj = {
//         list:
//         [{
//                 id: 1,
//                 num: 1,
//                 title: 'test',
//                 description: 'Hello world',
//                 status: 'in_progress'
//             }]
// };
    //Object.keys(allTasks).forEach(function(key) {
        //field = rows[key];
        //console.log(allTasks[key])
    //});
    //console.log(allTasks['RowDataPacket']);
    //res.send(allTasks[0]);
    res.render('listTasks', allTasks);
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
