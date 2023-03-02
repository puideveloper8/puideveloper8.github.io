// load questionSets into scope
// index 0 will be chosen as default on page load
const questionSetsJSON = [father, eatpig, l_20221023, necklace1, necklace2, necklace3, necklace4, necklace5, prince1, prince2, prince3, prince4, prince5, leaf1, leaf2, leaf3, leaf4, leaf5];

// ask youser before leaving the page if they really want to
window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = "";
});

// getting the DOM elements 
// Card Elements
let card = document.querySelector(".card")
let question = document.querySelector(".question");
let solution = document.querySelector(".solution");
let inputField = document.querySelector(".answer");
// Buttons
let checkAnswerBUTTON = document.querySelector(".check_answer");
let newWordBUTTON = document.querySelector(".new_word");
let correctBUTTON = document.querySelector(".correct");
let wrongBUTTON = document.querySelector(".wrong");
let reloadBUTTON = document.querySelector(".reload");
let returnBUTTON = document.querySelector(".return");
let showListBUTTON = document.querySelector(".show_list");
let printBUTTON = document.querySelector(".print_list");

// card-deck-choice-fields
const cardDeckOptions = [    
    "father",
    "eatpig",
    "l_20221023",
    "necklace1",
    "necklace2",
    "necklace3",
    "necklace4",
    "necklace5",
    "prince1",
    "prince2",
    "prince3",
    "prince4",
    "prince5",
    "leaf1",
    "leaf2",
    "leaf3",
    "leaf4",
    "leaf5",
];

// Text below the Cards
let remainingCards = document.querySelector(".remaining");
let knownCards = document.querySelector("#known");
let knownCardsCounter = 0;
let nextCards = document.querySelector("#next");
let reminingList = document.querySelector("#remaining_list");

// define question-set
// global questionSet
let questionSet = questionSetsJSON[0];
let nextRound = [];
// set a questionSet to start with
function defineQuestionSet(set) {
    questionSet = set;
}

// keep track of current deck-index (cardDeckOptions / questionSetsJSON)
let lastDeckIDX = 0;
// load the deck the user selects from the options-drop-down
let deckOptions = document.querySelector("#decks");
deckOptions.addEventListener("change", (e) => {
    let selectedDeck = deckOptions.value;
    let lastDeckIDX = cardDeckOptions.indexOf(selectedDeck);

    defineQuestionSet(questionSetsJSON[lastDeckIDX]);
    newCard();
    });

// flip Answer-Card back to Question
returnBUTTON.addEventListener("click", () => card.classList.remove("flipped"));


// gets a random pair (question/answer) from the a given array of objects
function getQuestionPair(dict) {
    let rand = Math.floor(Math.random() * dict.length);
    return Object.entries(dict)[rand][1];
}

// innitial randomPair on Page-Load
let randomPair = getQuestionPair(questionSet);

// display first question
displayQuestion(randomPair);

// write question on the front of card
function displayQuestion(rP) {
    // get curser into input-field
    if (inputField) inputField.focus(); 
    // remove input field from page if it is not needed (e.g. for rechtFragen)
    if (rP["input"]) {
        inputField.classList.remove("hidden");
        wrongBUTTON.classList.add("hidden");
        correctBUTTON.classList.add("hidden");
    } else {
        inputField.classList.add("hidden");
        wrongBUTTON.classList.remove("hidden");
        correctBUTTON.classList.remove("hidden");
    }
    // turn card to front-side
    card.classList.remove("flipped");
    // write question on front-side of the card
    question.innerHTML = rP["question"];
    // add hidden to the last answer, so the card-size rescales down (to question-size)
    solution.classList.add("hidden");

    // display current stack of cards
    remainingCards.innerHTML = `There are ${questionSet.length} cards left in the deck`
    knownCards.innerHTML = `Known so far: ${knownCardsCounter}`; 
    nextCards.innerHTML = `Next round: ${nextRound.length}`; 
}

// used inside of "flipBackAndDisplayAnswer" to split multiple answers
function splitPhraseIfSeveralNumbers(phrase) {
    let re = /\d\.\s.+\;/;
    if (re.test(phrase)) {
        phrase = phrase.split(";");
    }
    return phrase;
}

// flip card to back-side and display/render answer(s)
function flipBackAndDisplayAnswer() {
    // display answer on the back of the card
    card.classList.add("flipped");
    // the solution-text is hidden (so the card-size isn't too big from the last answer)
    solution.classList.remove("hidden");

    // if no input no "nächste question"
    if (randomPair["input"]) newWordBUTTON.classList.remove("hidden");
    else newWordBUTTON.classList.add("hidden");

    // create backside of the card
    let answer = document.querySelector(".answer");
    if (randomPair["input"]) {
        answer = answer.value;
        if (answer == randomPair["Answer"]) solution.innerHTML = "Correct!";
        else solution.innerHTML = `Leider nein leider garnischt.<br>Die richtige Answer wäre <em>"${randomPair["Answer"]}"</em> gewesen.`;
    } else {
        // create List of possible multiple-answer
        let answerList = splitPhraseIfSeveralNumbers(randomPair["Answer"]);
        // if it is just one answer display it
        if (typeof answerList == "string") solution.innerHTML = randomPair["Answer"];
        // if muslitple answers display them as a list
        else {
            solution.innerHTML = "";
            let answerListDOM = document.createElement("ol");
            solution.appendChild(answerListDOM);
            answerList.forEach(a => {
                // check if a number is in front and delete it so the ordered list tag provides numbers;
                let numRegEx = /^\s*\d+\.\s/g;
                a = a.replace(numRegEx, "");
                let listElement = document.createElement("li");
                answerListDOM.appendChild(listElement);
                listElement.innerHTML = a;
            });
        }
    } 

    // clear the input field if there is one for next questions
    let answerInput = document.querySelector(".answer");
    if (answerInput) answerInput.value = "";
}

// get a new card
function newCard() {
    if (questionSet.length === 0 && nextRound.length === 0){
        
        randomPair = {"question":"Yeah! Finished","Answer":"完成任務"};
        displayQuestion(randomPair);
    }    
    else {
        if (questionSet.length === 0 && nextRound.length > 0){
            questionSet = nextRound;
            questionSetsJSON[lastDeckIDX] = nextRound;
            nextRound = [];
        }
        // create new randomPair in global scope
        randomPair = getQuestionPair(questionSet);     
        displayQuestion(randomPair);   
    }
}

// removes current randomPair of question Answer from global questionSet-Array of objects
function removeCardFromSet(correct) {
    let idx = questionSet.findIndex(qa => qa["question"] == randomPair["question"]);
    let card = questionSet[idx];
    if (correct) {
        questionSet.splice(idx, 1);
        knownCardsCounter += 1;
    } else {
        nextRound.push(card);
        questionSet.splice(idx, 1);
    }
//    if (questionSet.length > 0 || nextRound.length > 0) 
    newCard();
}

// show the list from the nextRound
function showList(){
    let tbl = '<table class="table table-hover" id="table_word_list" >';
    tbl += '<caption class="mycaption question">背默表</caption>';
    tbl += '<thead class="thead-light">';
    tbl += '<tr>';
    tbl += '<th onclick="toggleQuestionColumn()" style="cursor: pointer;" class="question">詞語</th>';
    tbl += '<th onclick="toggleAnswerColumn()" style="cursor: pointer;" class="question">拼音</th>';
    tbl += '</tr>';
    tbl += '</thead>';
    tbl += '<tbody>';
    nextRound.forEach(element => {
        tbl += '<tr>';
        tbl += '<td class="question">';
        tbl += element["question"];
        tbl += '</td>';
        tbl += '<td class="solution">';
        tbl += element["Answer"];
        tbl += '</td></tr>';
    });
    tbl += '</tbody>';
    tbl += '</table>';
    reminingList.innerHTML = tbl;
}

function toggleQuestionColumn(){
    if ($( "td:nth-child(1)" ).css( "color") == "rgb(33, 37, 41)")
        $( "td:nth-child(1)" ).css( "color", "rgb(255, 255, 255)" );
    else    
        $( "td:nth-child(1)" ).css( "color", "rgb(33, 37, 41)" );
}

function toggleAnswerColumn(){
    if ($( "td:nth-child(2)" ).css( "color") == "rgb(33, 37, 41)")
        $( "td:nth-child(2)" ).css( "color", "rgb(255, 255, 255)" );
    else    
        $( "td:nth-child(2)" ).css( "color", "rgb(33, 37, 41)" );
}

function exportTableToExcel(){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById('table_word_list');
   // var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    var tableHTML = tableSelect.outerHTML;
    
    // Specify file name
    //filename = filename?filename+'.xls':'excel_data.xls';
    filename = "背默表.xls";

    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
   
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + encodeURI("\uFEFF" + tableHTML);
        //downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

// attache the show-result function to the button on frontside of card
checkAnswerBUTTON.addEventListener("click", flipBackAndDisplayAnswer);

// attache newWord-function to button on backside of card
newWordBUTTON.addEventListener("click", newCard);

// attache functionality "newCard" to wrong-button
wrongBUTTON.addEventListener("click", () => {
    removeCardFromSet(false);
});
correctBUTTON.addEventListener("click", () => {
    removeCardFromSet(true);
});

// reload the page / begin from the beginning
reloadBUTTON.addEventListener("click", () => location.reload());

// show the list
showListBUTTON.addEventListener("click", showList);

// show the list
printBUTTON.addEventListener("click", exportTableToExcel);


