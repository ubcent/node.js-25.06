const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const answersArr = [0, 1];

const promise = new Promise((resolve, reject) =>{
    setTimeout(() => {
        fs.readFile('./src/statistics.json', 'utf8', (err, data) =>{
            if(err){
                reject(err);
            }
            else {
                //console.log(data);
                resolve(JSON.parse(data));
            }
        });
    },1000);
});


promise.then(
    (statistics) => {
            const answerComp = answersArr[Math.floor(Math.random()*answersArr.length)];

            rl.question('Выберите Орел или Решка! (введите 0(решка) или 1(орел)): ', (answer) => {
                answer = parseInt(answer);
                console.log(answersArr.indexOf(parseInt(answer)));
                if ( answersArr.indexOf(answer) >= 0)
                {
                    console.log('Вы выбрали:  '+ (answer ? 'Орел' : 'Решка'));
                    console.log('Компьютер выбрал :  '+ (answerComp ? 'Орел' : 'Решка'));
                    if (answer === answerComp)
                    {
                        statistics.count_win +=1;
                        console.log('Поздравляем! Вы угадали!')
                        statistics = maxStatistic(1, statistics);
                    }
                    else {
                        statistics.count_lose +=1;
                        console.log('Вы не угадали :((( ')
                        statistics = maxStatistic(0, statistics);
                    }
                    statistics.count_game +=1;
                }
                else console.log('Необходимо ввести 0 или 1!');
                fs.writeFile("./src/statistics.json", JSON.stringify(statistics), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                });

                console.log("Пока!");
                rl.close();
            });
        },
    (err) => {console.log(err)}
);

function maxStatistic(win, statistic) {
    switch (win) {
        case 0:
            if(statistic.last_result === win)
            {
                statistic.max_lose += 1;
            }
            else {
                statistic.max_lose = 1;
            }
            break;
        case 1:
            if(statistic.last_result === win)
            {
                statistic.max_win += 1;
            }
            else {
                statistic.max_win = 1;
            }
            break;
    }
    statistic.last_result = win;

    return statistic;
}


//{ count_win: 0, count_lose: 1, count_game: 1 }

