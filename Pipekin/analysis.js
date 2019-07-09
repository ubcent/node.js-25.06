const fs = require('fs')
const path = require('path')

let log = 'log.txt'
if(process.argv[2] && typeof(process.argv[2]) == 'string'){
    if( fs.existsSync(path.join(__dirname, process.argv[2]))) log = process.argv[2] 
}

fs.readFile(path.join(__dirname, log), 'utf8', (err, data) => {
    if(err) throw err
    const arr = data.split('\n')
    arr.pop()
    const number = arr.length
    const win = arr.filter(el => el == 1) 
    const loose = arr.filter(el => el == 0)
    let count = 0, i = 0
    const winCount = arr.map(el => {
        if (el == 1) i++
        else if (i > count) {
            count = i,
            i=0 
        }
        else i = 0
    })  
    console.log(`Количество игр: ${number}, выиграл: ${win.length} раза, проиграл: ${loose.length}, `+
    `максимальная серия побед ${count}`)
})