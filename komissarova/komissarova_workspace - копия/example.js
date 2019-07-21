var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var app = express();
var wordOfDay = [];

app.get('/', function (req, res) {
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  
  
  request({
    method: 'GET',
    url: 'https://www.rbc.ru/'
    }, function(err, response, body, callback) {
      if (err) return console.error(err);
      
      
      $ = cheerio.load(body);

      
        for(let i = 0; i < 14; i++) {
            let newsText = $('.main__feed').eq(i).text().trim() + '\n';    
            wordOfDay = [];
      }

    //   var post = $('#content .singlemeta:first-child .post');
    //   var word = post.find('.title').eq(0).text().replace('\r\n\t\t\t\t\t', '').replace('\r\n\t\t\t\t', '');
    //   var definition = post.find('p').eq(0).text().replace('\n', '');
      
      
      wordOfDay.push(newsText);

  });
  
  
  res.send(JSON.stringify(wordOfDay, null, 4));
});


let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('listening on port ' + port);
});
 