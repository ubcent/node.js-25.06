const readline = require('readline'),    
    rl = readline.createInterface({
        input: process.stdin, 
        output: process.stdout 
    }),
    fs = require('fs');

const Eagle = (function () {    
    function Answer(answer) {        
        let randomAnswer = Math.floor(2 * Math.random()),
            answerText = '',
            result = 0;

        if (answer === '0' || answer === '1') {
            if(answer == randomAnswer) {
                answerText = 'Вы угадали';
                result = 1;
            } else {
                answerText = 'Вы не угадали';
                result = 0;
            }
        } else {
            answerText = 'Неправильный формат ввода';
        }
    
//         if(logFile) {
//             fs.exists(logFile, function(exists) {
//                 if(exists) {
//                     fs.appendFile(logFile, result + '\r\n', function (err) {
//                         if(err) {
//                             return console.log(err);
//                         }
//                     });
//                 } else {
//                     fs.open(logFile, 'a', function(){});
//                 }
//             });
//         }
        console.log(answerText);
        let logData = fs.appendFile('logData.txt', result + '\r\n', (err) => {
            if(err)
              throw err;
        });
    }

    return {
        run: function() {
            const logFile = process.argv.slice(2)[0];
            rl.question('Угадайте число: 0 или 1?\n', function(a) {
                Answer(a, logFile)
            });
            rl.on('line', function(a) {
                Answer(a, logFile)
            });
        }
    }    
})();

Eagle.run();