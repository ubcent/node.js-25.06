const request = require( 'request' );
const readline = require( 'readline' );

const rl = readline.createInterface( {
    input: process.stdin,
    output: process.output,
} );

console.log( `\nДобро пожаловать в КОНСОЛЬНЫЙ ПЕРЕВОДЧИК!!! \n
Введите текст на английском для перевода на русский. Для выхода введите "exit"\n` );

rl.on( 'line', ( line ) => {
    if ( line === 'exit' ) {
        console.log( 'Пока!' );
        rl.close();
        return
    }
    
    const promise = new Promise( ( resolve, reject ) => {
        request( `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190713T090512Z.3c74ed3e9b64c829.de140b6786200196780918b82cb61160dc7bdc7b&text=${ line }&lang=en-ru`, ( err, response ) => {
            if ( !err && response.statusCode === 200 ) {
                resolve( response );
            } else {
                reject( 'Ошибка получения запроса!' )
            }
        } );
    } );
    
    promise.then(
        ( response ) => {
            console.log( `\nВаш перевод:` );
            let translation = JSON.parse( response.body );
            console.log( translation.text[ 0 ] );
            console.log( `\nВведите текст на английском для перевода на русский. Для выхода введите "exit"\n` );
        },
        ( data ) => {
            console.log( data );
        },
    );
} );

