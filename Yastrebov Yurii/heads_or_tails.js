const fs = require('fs');
const os = require('os');
const readline = require('readline');
const fileName = process.argv[2].substring(1);
let results = [];
let step = 1;
let coin = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function random() {
  return Math.round(Math.random() +1);
}
function linePrepare () {
  let coin = random();
  rl.setPrompt('Выберите 1 или 2 (e-exit) > ');
  //rl.setPrompt('Выберите 1 или 2 (e-exit) (coin=' + coin + ')> ');
  rl.prompt();
  return coin;
}

coin = linePrepare();
step++;
rl.on('line', function(line) {
  if (line === "e") {
    //console.log(results);
    //console.log(step);
    //console.log(fileName);
    rl.close();
  }
  if (line.toString() === coin.toString()) {
    results [step] =1;
  } else {
    results [step] =0;
  }
  fs.appendFile(fileName, step + '-' + results[step] + os.EOL, (err) => {
    if (err) {
      console.error(err);
    }
  });
  coin = linePrepare();
  step++;
}).on('close',function(){
  process.exit(0);
  });