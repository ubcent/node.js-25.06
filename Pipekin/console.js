const readline = require('readline')
const Chance = require('chance')
const chance = new Chance()
const fs = require('fs')
const {Console} = require('console')
const path = require('path')

let log = 'log.txt'
const exists = fs.existsSync(path.join(__dirname, process.argv[2]));
if(exists) log = process.argv[2];

const out = fs.createWriteStream(log)

const write = new Console(out)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log('Орёл или решка? 1 - орёл, 2 - решка')
rl.on('line', (line) => {
    if (line != 'exit') {
        if (line == 1 || line == 2) {
            if (line == chance.integer({min: 1, max: 2})) {
                console.log('Угадал')
                write.log('1') }
            else {
                console.log('Не угадал')
                write.log('0') }
        } else console.log('Не корректный ввод')
    } else {
        rl.close()
        out.close()
    }
})
