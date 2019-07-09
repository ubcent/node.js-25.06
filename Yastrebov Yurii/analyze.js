const fs = require('fs');
const os = require('os');
const newLine = os.EOL;
const fileName = process.argv[2].substring(1);
const file = fs.readFileSync(fileName, 'utf-8', err => {
  if (err) console.error(err);
});
const rowArray = file.split(newLine).map(line =>+line.split('-')[1]);
const games = rowArray.length;
let wins =0;
let maximumWinsAtOnce = 0;
let maximumLosesAtOnce = 0;

for (let i in rowArray) {
  if (rowArray[i] === 1) wins++;
}
let loses = games - wins;
let i = 0;
let tempMaxWinAtOnce = 1;
let tempMaxLosesAtOnce = 1;
for (i; i<rowArray.length;i++) {
  if (rowArray[i] === rowArray[i+1]) {
    if (rowArray[i] === 1) {
      tempMaxWinAtOnce++;
      if (tempMaxWinAtOnce > maximumWinsAtOnce) maximumWinsAtOnce = tempMaxWinAtOnce;
    } else {
      tempMaxLosesAtOnce++;
      if (tempMaxLosesAtOnce > maximumLosesAtOnce) maximumLosesAtOnce = tempMaxLosesAtOnce;
    }
  } else {
    tempMaxWinAtOnce = 1;
    tempMaxLosesAtOnce = 1;
  }
}

//console.log(rowArray);
console.log('Общее к-во партий: '+ games);
console.log('К-во выигранных партий: ' + wins);
console.log('К-во проигранных партий: ' + loses);
console.log('Процент выигранных партий: ' + Math.round(wins/games*100));
console.log('Максимальное число побед подряд: ' + maximumWinsAtOnce);
console.log('Максимальное число поражений подряд: ' + maximumLosesAtOnce);