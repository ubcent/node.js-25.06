"use strict";
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
const filepath = `files/${argv._[0]}`;
let winNameRegExp = /\w+ \+/,
    loserNameRegExp = /\w+ -/,
    wins = {}, losers = {},
    gameCounter = 0;

fs.readFile(filepath, (err, data) => {
    if(err) {
        throw err;
    }

    console.log('------------------------');
    console.log('| Выиграл  | Проиграл  |');
    console.log('------------------------');
    console.log(data.toString());

    let list = data.toString().split('\n');
    list = list.filter((val) => val !== '');
    
    for(let item of list) {
        gameCounter++;

        if(item) {
            let winName = item.match(winNameRegExp);
            let loserName = item.match(loserNameRegExp);

            if(winName && loserName) {
                winName = winName.toString().slice(0, winName.length-2);
                loserName = loserName.toString().slice(0, loserName.length-2);
    
                if(!Object.keys(wins).includes(winName)) {
                    wins[winName] = 1;
                } else {
                    wins[winName] = wins[winName] + 1;
                }
    
                if(!Object.keys(losers).includes(loserName)) {
                    losers[loserName] = 1;
                } else {
                    losers[loserName] = losers[loserName] + 1;
                }
            }
        }
    }

    console.log('Таблица побед');
    console.log('-----------------');
    for(let win in wins) {
        console.log(`Игрок ${win} - ${wins[win]} побед(a/ы)`);
    }

    console.log('');
    console.log('Таблица проигрышей');
    console.log('-----------------');
    for(let loser in losers) {
        console.log(`Игрок ${loser} - ${losers[loser]} проигрыш(a)`);
    }

    console.log('');
    console.log('-----------------');
    console.log('Количество игр: ' + gameCounter);
});