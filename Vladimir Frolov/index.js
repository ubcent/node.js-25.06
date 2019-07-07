(function () {

    var readline = require('readline');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let question='Пожалуйста, введите вашу ставку: напишите \"орел\" или \"решка\"\n для выхода напишите \"выход\"';
    console.log(question);
    let victoryCount = 0, loseCount = 0;

    rl.on('line', function(answer) {
         let userJoice = answer;


         if (userJoice === "выход"){
            rl.close();
            return;
        }
         
         if(userJoice !== "орел" && userJoice !== "решка"){
             console.log("Некорректный ввод, попробуте снова");
             return;
         }
         let side = Math.random() < 0.5;

         let result = (side ? "орел" : "решка");

         if (userJoice === result) {
             victoryCount++;
             console.log("Ваш результат " + result + "\n" + "Вы выиграли!" + "\n");
             console.log("Вы победили " + victoryCount + " раз" + "\n" + "Вы проиграли " + loseCount + " раз");

         }
         else if (userJoice !== result){
             loseCount++;
             console.log("Ваш результат " + result + "\n" + "Извините, вы проиграли" + "\n");
             console.log("Вы победили " + victoryCount + " раз" + "\n" + "Вы проиграли " + loseCount + " раз");
         }
        console.log(question);
    });



})();