(function () {

    //Задание 2 Функция будет делать перевод с сайта yandex.ru
    const request = require('request');
    let readline = require('readline');
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Пожалуйста, введите слово на английском языке для получения перевода, для выхода введите \'exit\'");

    rl.on('line', function(answer) {

        let userQuery = answer;

        if (userQuery === "exit") {
            rl.close();
            return;
        }
        else {
            request.post(
                {
                    url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-ru&key=trnsl.1.1.20190714T151229Z.a8aee852b085edb7.e6388b2b93256a8e9aeab7f4804de6189576c192',
                    form: {text: userQuery}
                }
                , (err, response) => {
                    if(!err && response.statusCode === 200) {
                        let body=JSON.parse(response.body);
                        console.log(body.text[0]);
                        console.log("Введите следующий запрос или \'exit\'");
                    }



                });
        }
    });

})();