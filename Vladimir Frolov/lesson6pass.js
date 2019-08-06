//Require libraries
const path = require('path');

const express = require('express');
const consolidate = require('consolidate');

//Использовать базу данных mongoose
const mongoose = require('mongoose');

//Использовать ссесию express - что это?
const session = require('express-session');

//Использует переменную session в Mongo
const MongoStore = require('connect-mongo')(session);

//Создать переменные Task из папки models/task, User models/user и passport
const Task = require('./models/task');
const User = require('./models/user');
const passport = require('./passport');

/*Подключить базу данных mongoose todo по следующему адресу
Нужно прописать свои адрес mongodb*/
mongoose.connect('mongodb://192.168.99.100:32786/todo', { useNewUrlParser: true, useFindAndModify: true });

//Создать приложение express
const app = express();

//Интерпртеировать файлы hbs библиотекой handlbars
app.engine('hbs', consolidate.handlebars);
//Использовать в качестве типа отображения файлы hbs
app.set('view engine', 'hbs');
//Для файлов hbs использовать папку views
app.set('views', path.resolve(__dirname, 'views'));

//Использование при модуль express urlencoded для правильного отображения
app.use(express.urlencoded({ extended: false }));

//Использование модуля express для создания пароля в качестве параметра store передается база данных
//поэтому session используеься в переменной MongoStore выше
app.use(session({
    secret: 'super 12345 secret variable',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

//Использовать passport командой initialize и session
app.use(passport.initialize);

//Passport использует параметры session
app.use(passport.session);

//В папке task находятся параметры passport
app.use('/tasks', passport.checkAuthenticated);

//Берет переменные из файла Task(с большой буквы) b=из папки task
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find().lean();

    //Рендерит переменную Task из папки tasks и пишет completed при удачном завершении
    res.render('tasks', { tasks: tasks.map((task) => ({...task, completed: task.status === 'completed'})) });
});

//Модуль для редиректа
app.post('/tasks/add', async (req, res) => {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.redirect('/tasks');
});

//Модуль для удаления задач
app.post('/tasks/delete', async (req, res) => {
    await Task.findByIdAndRemove(req.body.id);
    res.redirect('/tasks');
});

//Ставит статус completed при обновлении id
app.post('/tasks/complete', async (req, res) => {
    await Task.findByIdAndUpdate(req.body.id, { $set: { status: 'completed' } });
    res.redirect('/tasks');
});

//Модуль для обновления задач
app.post('/tasks/update', async (req, res) => {
    await Task.findByIdAndUpdate(req.body.id, { $set: { title: req.body.title } });
    res.redirect('/tasks');
});

//Берет Task запрашивает params.id и делает render task
app.get('/tasks/:id/edit', async (req, res) => {
    const task = await Task.findById(req.params.id).lean();

    res.render('task', task);
});

//Если существует user делает редирект - иначе посылает на страницу регистрации
app.get('/register', async (req, res) => {
    if(req.user) {
        return res.redirect('/tasks');
    }

    res.render('register');
});

//При обращении к страничке /register создать user, затем редирект на /tasks
app.post('/register', async (req, res) => {
    const user = new User(req.body);
    const savedUser = await user.save();

    res.redirect('/tasks');
});

app.get('/auth', (req, res) => {
    if(req.user) {
        return res.redirect('/tasks');
    }
    res.render('auth', { error: !!req.query.error });
});

//При обращении к страничке /auth обратиться обработать переменную пасспорт
app.post('/auth', passport.authHandler);

//При обращении по пути logout сделать редирект на страничку /auth
app.get('/logout', (req, res) => {
    req.logout();

    res.redirect('/auth');
});

//Прослушивать порт 8888
app.listen(8888);

