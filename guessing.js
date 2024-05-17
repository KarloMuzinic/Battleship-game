"use strict";

let onTurn = null;
const aiTargets = playerCoordsArray.slice();
const aiGuesses = [];
const aiHits = [];
let aiMisses = [];
let aiSmartMoves = [];
let partialAiHits = {
  coords: [],
  rotation: "unknown",
  reset: function () {
    this.coords = [];
    this.rotation = "unknown";
  },
};

let aiButton = document.querySelector(".do_ai");

const takeSmartGuess = function () {
  partialAiHits.coords.forEach((coord) => {
    let x = getXCoord(coord);
    let y = getYCoord(coord);
    console.log(partialAiHits.rotation + " rot");
    if (partialAiHits.coords.length === 1) {
      markAdjacentLeftRight(x, y, 1);
      markAdjacentTopDown(x, y, 1);
    } else if (partialAiHits.rotation === "vertical") {
      markAdjacentTopDown(x, y, 1);
    } else if (partialAiHits.rotation === "horizontal") {
      markAdjacentLeftRight(x, y, 1);
    }
  });

  let chosen = aiSmartMoves[Math.floor(Math.random() * aiSmartMoves.length)];
  aiSmartMoves = [];
  console.log(chosen);
  return aiTargets.indexOf(chosen);
};

const getPosition = function () {
  if (partialAiHits.coords.length > 0) {
    return takeSmartGuess();
  } else {
    return Math.floor(Math.random() * aiTargets.length);
  }
};

const doAiGuess = function () {
  if (gameOver) return;
  if (onTurn === 0 || playerShips.length != 7) {
    console.log("Not AI Turn");
    return;
  }
  let position = getPosition();
  aiGuesses.push(aiTargets[position]);

  let [guess] = aiTargets.splice(position, 1);

  if (allOccupied.includes(guess)) {
    handleHit(guess);
    lastHighlighted.push(allOccupied[allOccupied.indexOf(guess)]);
    aiHits.push(guess);
  } else {
    const audio = new Audio("miss_shot.wav");
    audio.play();
    aiMisses.push(guess);
    guess.style.backgroundColor = "black";
    onTurn = 0;
    aiGridName.style.backgroundColor = "";
    playerGridName.style.backgroundColor = "green";
  }
};

const startGuessingStage = function () {
  onTurn = Math.floor(Math.random() * 2);
  if (onTurn) {
    aiGridName.style.backgroundColor = "green";
    //doAiGuess();
  } else {
    playerGridName.style.backgroundColor = "green";
  }
};

aiButton.addEventListener("click", doAiGuess);
