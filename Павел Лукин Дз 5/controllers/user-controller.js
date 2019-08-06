const BaseController = require('./base-controller');
const User = new require('./../models/user');
const userModel = new User();

class  UserController extends BaseController{
    constructor() {
        super();
    }

    static index(req, res) {
        userModel.list( async(rows) => {
            await res.render('index', {userList: rows});
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
}

module.exports = UserController;