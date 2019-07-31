
class BaseController {
    // base controller
    static checkResult(result) {
        if(result) {
            console.log('OK!!!!!!');
        } else {
            console.log('Error update');
        }
    }
}

module.exports = BaseController;