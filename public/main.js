let wordPicked = "";
let wordArr = [];
let answer = [];
let wrongGuesses = [];
let rightGuess = 0;
let chanceLeft = 6;

const startButton = document.getElementById("start-btn");
const letterButtons = document.getElementById("letters");
const chanceLeftElem = document.getElementById("chanceLeft");
const wrongGuessesElem = document.getElementById("wrongGuesses");
const answerElem = document.getElementById("answer");
const hangmanImg = document.getElementById("hangman-img");
const status = document.getElementById("status");
const playAgain = document.getElementById("playAgain-btn");

startButton.addEventListener("click", getWord, false);
playAgain.addEventListener("click", reset, false);

// pick a random word from the word list
function getWord() {
  fetch("/api/word")
    .then((res) => res.json())
    .then((res) => {
      startButton.style.display = "none";
      let wordList = res;
      wordPicked = wordList[
        Math.floor(Math.random() * wordList.length)
      ].toUpperCase();
      answer = Array(wordPicked.length).fill("_");
      wordArr = wordPicked.split("");
      console.log(wordPicked);
      document.getElementById("answer").innerText = answer.join(" ");
      displayLetters();
    })
    .catch((err) => console.log(err));
}

// display alphatbet buttons
function displayLetters() {
  let letterHTML = "";
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .map(
      (letter) =>
        (letterHTML +=
          `<button id=${letter} onClick="checkLetter('${letter}')">` +
          letter +
          "</button>")
    );
  letterButtons.innerHTML = letterHTML;
}

// check if the letter picked by a player is in the word.
function checkLetter(letter) {
  let indexArr = [];
  wordArr.forEach((c, index) => (c === letter ? indexArr.push(index) : null));

  if (indexArr && indexArr.length) {
    // if it exists in the word
    for (let idx of indexArr) {
      answer[idx] = letter;
    }
    answerElem.innerText = answer.join(" ");
    rightGuess += indexArr.length;
  } else {
    // if the letter doesn't exist in the word
    chanceLeft -= 1;
    wrongGuesses.push(letter);
    chanceLeftElem.innerText = "Chances Left: " + chanceLeft;
    wrongGuessesElem.innerText = "Wrong Guesses: " + wrongGuesses.join(", ");
    changeImg();
  }

  // disable the picked button
  document.getElementById(letter).disabled = true;
  gameStatus();
}

// change the image of hangman if a guess is wrong
function changeImg() {
  hangmanImg.setAttribute("src", `./images/${7 - chanceLeft}.png`);
}

//check if a player lost or won
function gameStatus() {
  if (!chanceLeft) {
    letterButtons.style.display = "none";
    htmlElem = `<h4>Correct Word: ${wordPicked} </h4>` + "<h3>Try Again?</h3>";
    status.innerHTML = htmlElem;
    playAgain.style.display = "inline";
  } else if (rightGuess == wordPicked.length) {
    letterButtons.style.display = "none";
    htmlElem = "<h3>You won!</h3>";
    status.innerHTML = htmlElem;
    playAgain.style.display = "inline";
  }
}

function reset() {
  location.reload();
}
