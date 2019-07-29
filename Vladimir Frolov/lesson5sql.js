//Require libraries
const express = require('express');
const path = require('path');

const consolidate = require('consolidate');

//Get local file dataBase.js
const Task = require('./dataBase/dataBase');

// const bodyParser = require('body-parser');

const app = express();

const Handlebars = require('handlebars');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
/**/

// до express@4 body-parser
// app.use(bodyParser.json());

/*
app.use(express.json()); // во всех post-запросах появляется req.body

app.use('/static', express.static(
    path.resolve(__dirname, 'public'),
));
*/

const getAll=async function(res){
    try {
        const tasks = await Task.getAll();
        res.render('tasks', {tasks:tasks});
    }catch (e) {
        console.log(e);
    }
};

app.get('/tasks', async (req, res) => {
    getAll(res);
});


app.get('/tasks/delete/:id', async (req, res) => {
    await Task.delete(req.params.id);
    getAll(res);
});


app.listen(8888);


