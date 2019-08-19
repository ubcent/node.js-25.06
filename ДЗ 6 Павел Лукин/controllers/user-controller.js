const BaseController = require('./base-controller');
const User = new require('./../models/user');
const userModel = new User();

class  UserController extends BaseController{
    constructor() {
        super();
    }

    static index(req, res) {
        userModel.list( async(rows) => {
            let login = req.session.login || null;
            await res.render('index', {userList: rows, login: login});
        });
    }

    static add(req, res) {
       let name = req.body.name;
       if(name) {
           userModel.add(req.body, async (result) => {
                super.checkResult(result);
                await userModel.list((rows) => {
                    res.redirect('/');
                });

           });
       }
    }

    static update(req, res) {
        let id = req.body.id;
        let newName = req.body.name;
        if(id && newName) {
            userModel.update(id, newName, async (result) => {
                super.checkResult(result);
                await userModel.list((rows) => {
                    res.redirect('/');
                });
            });
        }
    }

    static delete(req, res) {
        let id = req.params.id;
        if(id) {
            userModel.delete(id, async (result) => {
                super.checkResult(result);
                await userModel.list((rows) => {
                    res.redirect('/');
                });
            });
        }
    }

    static register(req, res) {
        const login =  req.body.login;
        const password = req.body.password;
        req.session.login = login;
        req.session.password = password;
        res.redirect('/');
    }

    static logout(req, res) {
        req.session.login = null;
        req.session.password = null;
        res.redirect('/');
    }
}

module.exports = UserController;