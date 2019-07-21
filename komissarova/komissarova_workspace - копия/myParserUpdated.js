// const request = require('request');
// const cheerio = require('cheerio');

// request('https://www.rbc.ru/', (err, response, html) => {
  
//   if(!err && response.statusCode === 200) {
//     const $ = cheerio.load(html);
    
//     console.log('Главное: ', $('.main__big').eq(0).text().trim() + '\n');
//     console.log('1:  ', $('.main__feed').eq(0).text().trim() + '\n');
//     console.log('2:  ', $('.main__feed').eq(1).text().trim() + '\n');
//     console.log('3:  ', $('.main__feed').eq(2).text().trim() + '\n');
//     console.log('4:  ', $('.main__feed').eq(3).text().trim() + '\n');
//     console.log('5:  ', $('.main__feed').eq(4).text().trim() + '\n');
//     console.log('6:  ', $('.main__feed').eq(5).text().trim() + '\n');
//     console.log('7:  ', $('.main__feed').eq(6).text().trim() + '\n');
//     console.log('8:  ', $('.main__feed').eq(7).text().trim() + '\n');
//     console.log('9:  ', $('.main__feed').eq(8).text().trim() + '\n');
//     console.log('10: ', $('.main__feed').eq(9).text().trim() + '\n');
//     console.log('11: ', $('.main__feed').eq(10).text().trim() + '\n');
//     console.log('12: ', $('.main__feed').eq(11).text().trim() + '\n');
//     console.log('13: ', $('.main__feed').eq(12).text().trim() + '\n');
//     console.log('14: ', $('.main__feed').eq(13).text().trim() + '\n');
//   }   
// });

const request = require('request');
const cheerio = require('cheerio');
const exports = module.exports = {};
exports.news = function() {
    request('https://www.rbc.ru/', (err, response, html) => {
  
        if(!err && response.statusCode === 200) {
         const $ = cheerio.load(html);
        

           for(let i = 0; i < 14; i++) {
         const newsText = $('.main__feed').eq(i).text().trim() + '\n';
        // const newsIndex = i + 1;
        //     console.log($('.main__feed').eq(i).text().trim() + '\n');
      //   consolonewsText); 
      return newsText;   
           }
         }
      });
    }         
           
module.exports = news;
//     app.use(express.json());
// app.use((req, res, next) => {
// //     const user = {
// //         firstName: 'Darth',
// //         lastName: 'Vaider',
// //         }
// //         res.send(user);
// //     });
// //     res.send()
//     console.log('Пипец');
//     next();
// });

// app.all('/news', (req, res) => {
//         // const newsText = $('.main__feed').eq(0).text().trim() + '\n';
//         res.send(newsText);
//         // for(let i = 0; i < 14; i++) {
           
//         // }

// });

// app.listen(8888);


// exports.posts = function() {
// request('https://tproger.ru/', (err, response, html) => {
  
//   if(!err && response.statusCode === 200) {
//     const $ = cheerio.load(html);

//     // console.log('Посты: ', $('.main__big').eq(0).text().trim() + '\n');

//     const postsCount = $('.post-title').length;
    
//    //  console.log('Посты: ' + '\n');

//     for(let i = 0; i < postsCount; i++) {
//         // const newsText = $('.main__feed').eq(i).text().trim() + '\n';
//         // const newsIndex = i + 1;
//         // console.log('Посты: ');
//         let postsText = $('.post-title').eq(i).text().trim() + '\n';
//         return(postsText);
//         // console.log(newsIndex + ' : ' + newsText);
//     }
//   }
// });
// }