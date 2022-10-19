// was used to refactor the vocab-list to give it also the "Fragen:..., Answer:..." Schema"

let ask = require("./ask.json");
let fs = require("fs");

function createQuestionAnswerFormat(data) {
    let questionAnswer = Object.entries(data).map(([question, answer]) => {
        let obj = {};
        obj["question"] = question;
        obj["Answer"] = answer;
        return obj;
    });
    console.log(questionAnswer);
    return questionAnswer;
}

let vokabeln = createQuestionAnswerFormat(ask);
console.log(vokabeln);

// commented out it does not accidently overwrite something
//fs.writeFile("./vokabeln.json", JSON.stringify(vokabeln));