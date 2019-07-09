const fs = require('fs');

const logFile = process.argv.slice(2);
if(logFile) {
    fs.readFile('orelreshka.txt', 'utf-8', (err, data) => {
        if(err) {
            throw err;
        };
    var luckParty = 0;
    var failParty = 0;
    var luckSeries = 0;
    var failSeries = 0;
    var luckCount = 1;
    var failCount = 1;
    const arrData =  data.slice(0,-1).split(',');
    for (let i = 0; i < arrData.length; i++) {
        if(arrData[i] === 'Партия проиграна') {
            failParty++;
            var count = i + 1;
            while(arrData[i] === arrData[count]){
                failCount++;
                count++;
            };
            if (failCount > failSeries) {
                failSeries = failCount;
            };
            failCount = 1;
        } else if(arrData[i] === 'Партия выиграна') {
            luckParty++;
            count = i + 1;
            while(arrData[i] === arrData[count]){
                luckCount++;
                count++;
            };
            if (luckCount > luckSeries) {
                luckSeries = luckCount;
            };
            luckCount = 1;
        };
    };
    console.log(`партий: ${arrData.length}; Выиграно: ${luckParty}; Проиграно: ${failParty}; в соотношении: ${luckParty/failParty}; Макс. побед подряд: ${luckSeries}; Макс. поражений подряд: ${failSeries}`);
    })
} else {
    console.log('Не указан файл лога orelreshka.txt');
    process.exit(1);
}