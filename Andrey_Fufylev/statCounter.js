/*
2) Сделать программу-анализатор игровых логов. В качестве
аргумента программа получает путь к файлу. Выведите игровую
статистику: общее количество партий, количество выигранных /
проигранных партий и их соотношение, максимальное число побед /
проигрышей подряд.
*/

const fs = require( 'fs' );

let fileName = 'log.txt'; // имя файл

if ( process.argv[ 2 ] ) {
    fileName = process.argv[ 2 ]; // переназначаем имя файла
}

fs.readFile( fileName, 'utf8', ( err, data ) => {
    if ( err ) {
        throw err;
    } else {
        let log = JSON.parse( data );
        counter( log );
    }
} );

const counter = ( log ) => {
    let gamesCount = log.length;
    let wonGames = 0;
    let failedGames = 0;
    let wonArr = [];
    let failedArr = [];
    let maxWonGamesInRow = 0;
    let maxFailedGamesInRow = 0;
    let ifWon = false;
    let ifFailed = false;
    
    
    for ( let el of log ) {
        if ( el.result === 'won' ) {
            wonGames++;
            ifWon = true;
            ifFailed = false;
        }
        if ( el.result === 'failed' ) {
            failedGames++;
            ifWon = false;
            ifFailed = true;
        }
        if ( el.result === 'won' || ifWon ) {
            maxWonGamesInRow++;
        } else {
            wonArr.push( maxWonGamesInRow );
            maxWonGamesInRow = 0;
            
        }
        if ( el.result === 'failed' || ifFailed ) {
            maxFailedGamesInRow++;
        } else {
            failedArr.push( maxFailedGamesInRow );
            maxFailedGamesInRow = 0;
        }
    }
    let ratioBetweenWonAndFailed =
        `${ Math.floor( wonGames / gamesCount * 100 ) }% выигрышных партий / ${ ( 100 - Math.floor( wonGames / gamesCount * 100 ) ) }% проигрышных партий`;
    
    maxWonGamesInRow = wonArr.reduce( ( a, b ) => Math.max( a, b ) );
    maxFailedGamesInRow = failedArr.reduce( ( a, b ) => Math.max( a, b ) );
    
    console.log( `Общее количество партий - ${ gamesCount }` );
    console.log( `Количество выигранных партий - ${ wonGames }` );
    console.log( `Количество проигранный партий - ${ failedGames }` );
    console.log( `Соотношение партий - ${ ratioBetweenWonAndFailed }` );
    console.log( `Максимальное число побед подряд - ${ maxWonGamesInRow }` );
    console.log( `Максимальное число проигрышей подряд - ${ maxFailedGamesInRow }` );
};