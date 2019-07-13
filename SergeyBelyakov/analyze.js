const fs = require('fs');

const argv = (process.argv.slice(2,3));
let stats = {};

console.log(`Анализ лога ${argv}:\n`);

const promise = new Promise((resolve, reject) => {
    fs.readFile(`./users_logs/${argv}`, 'utf8', ((err, data) => {

        if (err) {

            return reject(err);
        }
        resolve(data);
    }));
});

promise
    .then(data => {
        let result;
        stats = JSON.parse(data);

        result = `Всего было сыграно ${stats.count} игр.\n` +
                 `${stats.wins} (${Math.ceil(stats.wins / stats.count * 100)} %) побед, ${stats.maxWinStreak} побед подряд,\n` +
                 `${stats.loss} (${Math.ceil(stats.loss / stats.count * 100)} %) поражений, ${stats.maxLossStreak} поражений подряд.`;

        return console.log(result);
    })
    .catch(err => console.log(err));