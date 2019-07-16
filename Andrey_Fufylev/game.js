/*
1) Написать консольную игру "Орел или решка", в которой надо будет
угадывать выпадающее число (1 или 2). В качестве аргумента
программа может принимать имя файла для логирования
результатов каждой партии. В качестве более продвинутой версии
задания можете реализовать простейшую версию игры Blackjack.
*/

const fs = require( 'fs' );
const readline = require( 'readline' );
const moment = require( 'moment' );
const initialJson = []; // пустой массив для первоначального наполнения лога

let fileName = 'log.txt'; // имя файла или путь к нему

if ( process.argv[ 2 ] ) {
    fileName = process.argv[ 2 ]; // переназначаем имя файла или путь к нему
}

const rl = readline.createInterface( {
    input: process.stdin,
    output: process.output,
} );

// создаем файл если нет с таким именем
fs.access( fileName, fs.F_OK, ( err ) => {
    if ( err ) {
        fs.writeFile( fileName, JSON.stringify( initialJson, null, 4 ), ( err ) => {
            if ( err ) {
                throw err;
            } else {
                //console.log( 'Success' );
            }
        } );
    }
} );

console.log( `Добро пожаловать в игру "ОРЕЛ ИЛИ РЕШКА" \n
Введите число 1 (орел) или 2 (решка). Для выхода из игры введите "exit"` );

let addLog = ( log, newLog ) => {
    log.push( newLog );
    return JSON.stringify( log, null, 4 );
};

rl.on( 'line', ( line ) => {
    let rnd = Math.random() > 0.5 ? 2 : 1; // выбор компьютера
    
    if ( line === 'exit' ) {
        console.log( 'Пока!' );
        rl.close();
    } else if ( !line.match( /[1-2]/ ) ) {
        console.log( 'Не правильный ввод' );
        console.log( 'Введите число 1 (орел) или 2 (решка). Для выхода из игры введите "exit"' );
    } else if ( +line === rnd ) {
        console.log( 'Вы угадали! Вы молодец! Пока' );
        console.log( 'Введите число 1 (орел) или 2 (решка). Для выхода из игры введите "exit"' );
    } else {
        console.log( 'Вы НЕ угадали' );
        console.log( 'Введите число 1 (орел) или 2 (решка). Для выхода из игры введите "exit"' );
    }
    // если ввели 1 или 2 записываем лог
    if ( line.match( /[1-2]/ ) ) {
        fs.readFile( fileName, 'utf8', ( err, data ) => {
            if ( err ) {
                throw err;
            } else {
                let log = {
                    computed_choice: rnd,
                    gamer_choice: line,
                    result: +line === rnd ? 'won' : 'failed',
                    time: `${ moment().format( 'MMMM Do YYYY, h:mm:ss a' ) }`
                };
                let newLog = addLog( JSON.parse( data ), log );
                fs.writeFile( fileName, newLog, ( err ) => {
                    if ( err ) {
                        throw err;
                    } else {
                        //console.log( 'Success' );
                    }
                } );
            }
        } );
    }
} );
