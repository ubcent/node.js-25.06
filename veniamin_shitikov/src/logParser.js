const os = require('os');
const fs = require('fs');

const newLine = os.EOL;
const file = process.argv[2];

const data = fs.readFileSync(file, 'utf-8');

const loggs = data
  .split(newLine)
  .filter(Boolean)
  .map(line => +line.split(':')[1]);

const maxResultRow = result => {
  let count = 0;
  let maxCount = 0;

  loggs.forEach(log => {
    if (log === result) {
      count++;
      maxCount = Math.max(count, maxCount);
      return;
    } else {
      count = 0;
    }
  });

  return maxCount;
};

const total = loggs.length;
const wins = loggs.filter(Boolean).length;
const loses = total - wins;
const maxWinsRow = maxResultRow(1);
const maxLosesRow = maxResultRow(0);

console.log('Всего игр: ', total);
console.log('Выиграно игр: ', wins);
console.log('Проиграно игр: ', loses);
console.log('Процент выигранных игр: ', Math.trunc((100 * wins) / total), '%');
console.log('Максимум выигранных подряд игр: ', maxWinsRow);
console.log('Максимум проигранных подряд игр: ', maxLosesRow);
