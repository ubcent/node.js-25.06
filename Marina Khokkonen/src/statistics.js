const minimist = require("minimist");
const fs = require("fs");

const argv = minimist(process.argv.slice(2));
const promise = new Promise((resolve, reject) =>{
    fs.readFile(`./src/${argv.file}`, "utf8", (err, data) =>{
        if(err){
            reject(err);
        }
        else {
            resolve(JSON.parse(data));
        }
    });
});


promise.then(
    (statistics) => {
            console.log(`
                         Игр: ${statistics.count_game}
                         Выиграно: ${statistics.count_win}
                         Проиграно: ${statistics.count_lose}
                         Проиграно партий подряд: ${statistics.max_lose}
                         Выиграно партий подряд: ${statistics.max_win}
                         `);
    },
    (err) => {console.log(err)}
);

//node src/statistics.js --file=statistics.json