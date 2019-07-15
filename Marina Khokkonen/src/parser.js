const request = require("request");
const cheerio = require("cheerio");
request("https://tproger.ru/", (err, response, html)=>{
    if (err) {
        console.log("Не удалось получить страницу: ", err);
    }
    else if(!err && response.statusCode === 200){
        const $ = cheerio.load(html),
            posts = $(".post-text");

        const postsArr = [];

        posts.each(function(i, elem) {
            postsArr.push({
                "id" : i,
                "title" : $(this).find(".entry-title").text(),
                "content" : $(this).find(".entry-content p").text()
            });
        });
        console.log(postsArr);
    }
    else console.log("Ошибка");

});