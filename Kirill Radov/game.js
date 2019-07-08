const stat = {
    "statistic": [],
    "statFileName": "stat.json",

    statFile() {
        if (!process.argv[2]) {
            return this.statFileName;
        } else {
            return process.argv[2];
        }
    },

    statisticWrite(userChoise, winOrLose, systemChoice) {
       let stat = {"userChoice": userChoise,
               "sysChoice": systemChoice,
               "playerWin": winOrLose,
           };
       this.statistic.push(stat);
    },

    statisticWriteToFile() {
        if (this.statistic.length) {
            const fs = require("fs");
            let statJSON = JSON.stringify(this.statistic, ",", 4);
            fs.writeFileSync(`./${this.statFile()}`, statJSON, (err) => {
                if(err) {
                    console.log("Ошибка. Файл статистики не найден. Или не передан в параметрах.");
                }
            });
        }
    },
    statisticShow() {
        const fs = require("fs");
        fs.readFile(`./${this.statFile()}`, "utf8", (err, data) => {
            if(err) {
                console.log("Ошибка. Файл статистики не найден. Или не передан в параметрах.");
            } else  {
                const parsedData = this.parseStat(data);
                console.log("Статистика прошлой игры:");
                console.log("Всего партий: " + parsedData.gamesCount);
                console.log("Всего побед: " + parsedData.winsCount);
                console.log("Всего проигрышей: " + parsedData.loseCount);
                console.log("Соотношение побед и поражений: " + parsedData.winsCount + ":" + parsedData.loseCount );
                console.log("Процент побед: " + Math.round(parsedData.winRatio));
                console.log("Процент проигрышей: " + Math.round(parsedData.loseRatio));
                console.log("Подряд побед: " + parsedData.maxWinLine);
                console.log("Подряд проигрышей: " + parsedData.maxLoseLine);
            }
        });
    },

    parseStat(data) {
        const dataObj = JSON.parse(data);
        let winLine = 0;
        let loseLine = 0;
        const parsedData = {
            "gamesCount": 0,
            "winsCount": 0,
            "loseCount": 0,
            "maxWinLine": 0,
            "maxLoseLine": 0,
            "winRatio": 0,
            "loseRatio": 0,
        };

        parsedData.gamesCount = dataObj.length;

        for (let a of dataObj) {
            if (a.playerWin) {
                parsedData.winsCount++;
            }
        }
        parsedData.loseCount = dataObj.length - parsedData.winsCount;
        parsedData.winRatio = (parsedData.winsCount / parsedData.gamesCount) * 100;
        parsedData.loseRatio = (parsedData.loseCount / parsedData.gamesCount) * 100;

        for(let a of dataObj) {
            if (a.playerWin) {
                winLine++;
            } else if (!a.playerWin && winLine > parsedData.maxWinLine) {
                parsedData.maxWinLine = winLine;
                winLine = 0;
            } else if (!a.playerWin && winLine < parsedData.maxWinLine ) {
                winLine = 0;
            }
        }

        for(let a of dataObj) {
            if (!a.playerWin) {
                loseLine++;
            } else if (a.playerWin && loseLine > parsedData.maxLoseLine ) {
                parsedData.maxLoseLine = loseLine;
                loseLine = 0;
            } else if (a.playerWin && loseLine < parsedData.maxLoseLine ) {
                loseLine = 0;
            }
        }
        return parsedData;
    },

};

const game = {

    init() {
        console.log("\nВас приветствует игра угадай Орел или Решка!\nВведите в консоле 1 - Решка, 2 - Орел.\nДля выхода напишите 'exit'");
        const readline = require("readline");
        let rl = readline.createInterface ({
                input: process.stdin,
                output: process.stdout
            }
        );

        rl.on('line', (input) => {
            switch (input) {
                case "exit":
                    console.log("Пока!");
                    stat.statisticWriteToFile();
                    rl.close();
                    process.exit();
                    break;
                case "1":
                    console.log("Вы выбрали решку.");
                    this.game(1);
                    break;
                case "2":
                    console.log("Вы выбрали орел.");
                    this.game(2);
                    break;
                case "stat":
                    stat.statisticShow();
                    break;
                default:
                    console.log("Вы ввели: " + input);
            }
        })
    },
    
    game(userAnswer) {
        let winOrLose = false;
        let randomMonet = this.random(1,2);
        if (userAnswer === randomMonet) {
            winOrLose = true;
            console.log("Поздравляю вы угадали!\nВведите в консоле 1 - Решка, 2 - Орел.\nДля выхода напишите 'exit'");
        } else console.log("Вы не угадали :(\nВведите в консоле 1 - Решка, 2 - Орел.\nДля выхода напишите 'exit'");
        stat.statisticWrite(userAnswer, winOrLose, randomMonet);

    },

    random(min,max) {
       return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};

game.init();