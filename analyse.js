const readline = require('readline'),    
    rl = readline.createInterface({
        input: process.stdin, 
        output: process.stdout 
    }),
    fs = require('fs');

const EagleAnalyse = (function () {
    function Statistic(logFile) {   
        let count = 0, win = 0, winC = 0, loos = 0, loosC = 0;
        if (logFile) {
            fs.exists(logFile, function (exists) {
                if (exists) {
                    fs.createReadStream("logData.txt")
                        .on('data', function (chunk) {

                            let arr = chunk.toString().split('\r\n'),
                                arrWins = chunk.toString().replace(/(?:\\[rn]|[\r\n]+)+/g, "").split('0'),
                                arrLoos = chunk.toString().replace(/(?:\\[rn]|[\r\n]+)+/g, "").split('1');

                            arrLoos.map(function(i){
                                loosC = (i.length > loosC) ? i.length : loosC;
                            });
                            arrWins.map(function(i){
                                winC = (i.length > winC) ? i.length : winC;
                            });

                            count = arr.length - 1;
                            arr.forEach(function(i){
                                if(i == 0){
                                    loos++
                                }else if(i == 1){
                                    win++
                                }
                            })
                        })
                        .on('end', function (line) {
                            console.log("Общее количество партий: " + count);
                            console.log("Общее кол-во побед: " + win);
                            console.log("Общее кол-во поражений: " + loos);
                            console.log("Соотношение побед и прогрышей: " + ( win/ loos ).toFixed(2));
                            console.log("Максимальное число побед: " + winC);
                            console.log("Максимальное число прогрышей: " + loosC);
                        });
                }
            });
        }
    }

    return {
        run: function () {
            let logFile = process.argv.slice(2)[0];
            Statistic("logData.txt");
        }
    }
})();

EagleAnalyse.run();