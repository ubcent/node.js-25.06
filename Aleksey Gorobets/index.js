const math = require('math');
const readline = require('readline');
const ansi = require('ansi');
const cursor = ansi(process.stdout);
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const logFile = process.argv.slice(2);

if(logFile[0]) {
    console.log('Угадайте выпадающее число 1 или 2. Закончить игру - exit');
    rl.on('line', (line) => {
        let num = math.round(math.random() + 1 );
        if (line === 'exit') {
            console.log(('Игра закончена'));
            rl.close();
        } else if (line === num.toString()) {
            cursor
                .green()
                .write('Вы угадали!')
                .write('\n');
            console.log('Партия выиграна');
            cursor.reset();
            fs.appendFile(logFile[0], 'Партия выиграна,', 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
        } else  {
            cursor
                .red()
                .write('Вы не угадали!')
                .write('\n');
            console.log('Партия проиграна');
            cursor.reset();
            fs.appendFile(logFile[0], 'Партия проиграна,', 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
} else {
    console.log('Не указан файл лога orelreshka.txt');
    process.exit(1);
}

