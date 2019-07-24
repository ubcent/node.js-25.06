const request = require('request');
const cheerio = require('cheerio');

request('https://www.rbc.ru/', (err, response, html) => {
  
  if(!err && response.statusCode === 200) {
    const $ = cheerio.load(html);
    
    console.log('Главное: ', $('.main__big').eq(0).text().trim() + '\n');
    console.log('1:  ', $('.main__feed').eq(0).text().trim() + '\n');
    console.log('2:  ', $('.main__feed').eq(1).text().trim() + '\n');
    console.log('3:  ', $('.main__feed').eq(2).text().trim() + '\n');
    console.log('4:  ', $('.main__feed').eq(3).text().trim() + '\n');
    console.log('5:  ', $('.main__feed').eq(4).text().trim() + '\n');
    console.log('6:  ', $('.main__feed').eq(5).text().trim() + '\n');
    console.log('7:  ', $('.main__feed').eq(6).text().trim() + '\n');
    console.log('8:  ', $('.main__feed').eq(7).text().trim() + '\n');
    console.log('9:  ', $('.main__feed').eq(8).text().trim() + '\n');
    console.log('10: ', $('.main__feed').eq(9).text().trim() + '\n');
    console.log('11: ', $('.main__feed').eq(10).text().trim() + '\n');
    console.log('12: ', $('.main__feed').eq(11).text().trim() + '\n');
    console.log('13: ', $('.main__feed').eq(12).text().trim() + '\n');
    console.log('14: ', $('.main__feed').eq(13).text().trim() + '\n');
  }   
});