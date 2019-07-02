const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.output,
});

rl.on('line', (line) => {
  console.log('Вы ввели: ' + line);

  if(line === 'exit') {
    console.log('Пока!');
    rl.close();
  }
});