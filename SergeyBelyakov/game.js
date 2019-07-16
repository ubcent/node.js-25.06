const readline = require('readline');
const fs = require('fs');

const argv = process.argv.slice(2,3);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const gameStat = {
    count: 0,
    wins: 0,
    loss: 0,
    winStreak: 0,
    lossStreak: 0,
    boolStreak: false,
    maxWinStreak: 0,
    maxLossStreak: 0
};

console.log('Орел(1) или решка(2)? Для выхода \'e\' без кавычек!');
rl.on('line', (line) => {
    if (line === 'e' || line === 'е') {
        rl.close();
        if (argv.length) {
            fs.writeFile('./users_logs/' + argv, JSON.stringify(gameStat), (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
        console.log(`Для анализа игровой сессии запустите \"analyze ${argv}\"`);
    } else {
        const random = Math.floor(Math.random() * 2 + 1);
        console.log(`Выпало ${random === 1 ? 'орел' : 'решка'}`);
        if (parseInt(line) === random) {
            console.log("Поздравляем, Вы угадали!");

            gameStat.wins++;
            gameStat.winStreak++;

            if (!gameStat.boolStreak) {
                gameStat.boolStreak = !gameStat.boolStreak;

                if (gameStat.lossStreak > gameStat.maxLossStreak) {
                    gameStat.maxLossStreak = gameStat.lossStreak;
                }

                gameStat.lossStreak = 0;
            }
        } else {
            console.log("К сожалению, Вы проиграли!");

            gameStat.loss++;
            gameStat.lossStreak++;

            if (gameStat.boolStreak) {
                gameStat.boolStreak = !gameStat.boolStreak;

                if (gameStat.winStreak > gameStat.maxWinStreak) {
                    gameStat.maxWinStreak = gameStat.winStreak;
                }
                gameStat.winStreak = 0;
            }
        }
        gameStat.count++;
    }
});

