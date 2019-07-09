"use strict";
const input = require('input');
var fs = require('fs');

let gamerName = "";
let cardNumFromGamer = 0;
let cardNumFromPC = 0;
const blackJack = 21;

function randomNumber(){
    return Math.floor(Math.random() * 11) + 1;
}

async function start() {
    const name = await input.text('Добрый день, Игрок! Хочешь сыграть против компьютера? Ну давай! Но сначало введи свое имя.');
    if(!name) {
        start();
        return false;
    } else {
        gamerName = name;
        let step = '';

        do {
            step = await input.text(`Ну что, ${gamerName}! Ты ходишь? (+ = да; - = нет).`);
            if(step === '+') {
                let randomG = await randomNumber();
                cardNumFromGamer += randomG;
                console.log(`${gamerName} : ${cardNumFromGamer}`);
            }
        } while(step !== '-')

        let stepFromPC = setInterval( async() => {
            let random = await randomNumber();
            if(cardNumFromPC < blackJack && cardNumFromPC + random < blackJack) {
                cardNumFromPC += random;
                console.log(`PC : ${cardNumFromPC}`);
            } else {
                clearInterval(stepFromPC);

                console.log('-----------------');
                console.log(`${gamerName} : ${cardNumFromGamer}`);
                console.log(`PC : ${cardNumFromPC}`);
                console.log('-----------------');

                if(cardNumFromGamer <= 21) {
                    let textMsg = "";
                    if(cardNumFromGamer > cardNumFromPC){
                        logger(gamerName, cardNumFromGamer, 'PC', cardNumFromPC);
                    } else if(cardNumFromGamer === cardNumFromPC) {
                        textMsg = 'Ничья!';
                        console.log(textMsg);
                        writeFile(`Между ${gamerName} и PC ничья!`);
                    } else {
                        logger('PC', cardNumFromPC, gamerName, cardNumFromGamer);
                    }
                } else {
                    logger('PC', cardNumFromPC, gamerName, cardNumFromGamer);
                }
            }
        }, 1000);
    }
}

async function logger(win, winNum, loser, loserNum) {
    let text = `Проиграл ${loser}, у него ${loserNum}\nВыиграл ${win}, у него ${winNum}`;
    console.log(text);
    let logText = `${win} + ${winNum};      ${loser} - ${loserNum};`;
    await writeFile(logText);
}

async function writeFile(_text) {
    const text = _text + '\n';
    var argv = require('minimist')(process.argv.slice(2));
    const filepath = `files/${argv._[0]}`;

    await fs.exists(filepath, async (err) => {
        if(!err) {
            await fs.writeFile(filepath, text, (err) => {
                if(err) {
                    throw err;
                }
            });
        } else {
            await fs.appendFile(filepath, text, (err) => {
                if(err) {
                    throw err;
                }
            });
        }
    });
}

start();
   