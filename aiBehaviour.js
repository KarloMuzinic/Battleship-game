"use strict";

let aiRotation = "";
const aiShipsArray = ["ac", "bat", "cru", "des", "des", "sub", "sub"];
let allAiOccupied = [];
let aiCoordsToPlace = [];
let aiSurroundingOccupied = [];
let aiShips = [];

//surrounding
const markAiSurroundingOccupied = function (coord) {
  const x = getAiXCoord(coord);
  const y = getAiYCoord(coord);
  let occX, occY;

  for (occY = y - 1; occY <= y + 1; occY++) {
    for (occX = x - 1; occX <= x + 1; occX++) {
      if (
        occX >= 0 &&
        occX <= 9 &&
        occY >= 0 &&
        occY <= 9 &&
        (occX !== x || occY !== y)
      ) {
        if (occY === 0) {
          aiSurroundingOccupied.push(aiCoordsArray[occX]);
        } else {
          aiSurroundingOccupied.push(aiCoordsArray[occY * 10 + occX]);
        }
      }
    }
  }
};

const getAiXCoord = function (coord) {
  let x = "";
  x = coord.classList.value;

  const i = x.indexOf(" x_");
  x = x.substring(i + 3, i + 4);
  return Number(x);
};
const getAiYCoord = function (coord) {
  let y = "";
  y = coord.classList.value;

  const i = y.indexOf(" y_");
  y = y.substring(i + 3, i + 4);
  return Number(y);
};

//highlighting

const aiHighlightCoords = function (coords) {
  aiShips.push(coords);

  coords.forEach(function (coord) {
    //coord.style.backgroundColor = "rgba(0, 95, 130, 0.5)";
    allAiOccupied.push(coord);
    markAiSurroundingOccupied(coord);
  });
};

const placeAiShipOnGrid = function (shipName) {
  let isValidAiPlacement = true;
  aiCoordsToPlace = [];
  if (Math.floor(Math.random() * 2) + 1 === 1) aiRotation = "vertical";
  else aiRotation = "horizontal";
  let i,
    ceiling = 0;
  let step = aiRotation === "vertical" ? 10 : 1;
  let randCoord = Math.floor(Math.random() * 100) + 1;
  switch (shipName) {
    case "ac":
      if (aiRotation === "vertical") {
        i = randCoord - 20;
        ceiling = randCoord + 21;
      } else {
        i = randCoord - 2;
        ceiling = randCoord + 3;
      }
      break;

    case "bat":
      if (aiRotation === "vertical") {
        i = randCoord - 10;
        ceiling = randCoord + 21;
      } else {
        i = randCoord - 1;
        ceiling = randCoord + 3;
      }
      break;

    case "cru":
      if (aiRotation === "vertical") {
        i = randCoord - 10;
        ceiling = randCoord + 11;
      } else {
        i = randCoord - 1;
        ceiling = randCoord + 2;
      }
      break;

    case "des":
      if (aiRotation === "vertical") {
        i = randCoord;
        ceiling = randCoord + 11;
      } else {
        i = randCoord;
        ceiling = randCoord + 2;
      }
      break;

    case "sub":
      if (aiRotation === "vertical") {
        i = randCoord;
        ceiling = randCoord + 1;
      } else {
        i = randCoord;
        ceiling = randCoord + 1;
      }
      break;
  }

  while (i < ceiling) {
    const checkHor =
      aiRotation === "horizontal" &&
      Math.floor(randCoord / 10) !== Math.floor(i / 10);
    if (
      i < 0 ||
      i > 99 ||
      allAiOccupied.includes(aiCoordsArray[i]) ||
      checkHor ||
      aiSurroundingOccupied.includes(aiCoordsArray[i])
    ) {
      placeAiShipOnGrid(shipName);
      isValidAiPlacement = false;
      break;
    } else {
      if (aiSurroundingOccupied.includes(aiCoordsArray[i])) {
        placeAiShipOnGrid(shipName);
        isValidAiPlacement = false;
        break;
      }

      aiCoordsToPlace.push(aiCoordsArray[i]);
    }
    i += step;
  }
  if (isValidAiPlacement) aiHighlightCoords(aiCoordsToPlace);
};

aiShipsArray.forEach((shipName) => {
  placeAiShipOnGrid(shipName);
});

const doElimination = function (allToEliminate, smartMove) {
  allToEliminate.forEach(function (coord) {
    if (coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9) {
      return;
    } else {
      let i = coord[1] * 10 + coord[0];
      if (aiMisses.includes(playerCoordsArray[i])) return;
      if (smartMove) {
        if (aiHits.includes(playerCoordsArray[i]) === false)
          aiSmartMoves.push(playerCoordsArray[i]);
        return;
      }
      if (aiHits.includes(playerCoordsArray[i]) === false)
        aiMisses.push(
          aiTargets.splice(aiTargets.indexOf(playerCoordsArray[i]), 1)
        );
      aiMisses = aiMisses.flat();
      //playerCoordsArray[i].style.backgroundColor = "yellow";
    }
  });
};

const markAdjacentDiagonals = function (x, y, smartMove = 0) {
  let allToEliminate = [
    [x - 1, y - 1],
    [x + 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y + 1],
  ];
  doElimination(allToEliminate, smartMove);
};

const markAdjacentTopDown = function (x, y, smartMove = 0) {
  let allToEliminate = [
    [x, y - 1],
    [x, y + 1],
  ];
  doElimination(allToEliminate, smartMove);
};

const markAdjacentLeftRight = function (x, y, smartMove = 0) {
  let allToEliminate = [
    [x - 1, y],
    [x + 1, y],
  ];
  doElimination(allToEliminate, smartMove);
};

const determineRotation = function () {
  let x1 = getXCoord(partialAiHits.coords[0]);
  let x2 = getXCoord(partialAiHits.coords[1]);
  partialAiHits.rotation = x1 === x2 ? "vertical" : "horizontal";
};

const eliminateLast2 = function () {
  partialAiHits.coords.forEach((coord) => {
    if (partialAiHits.rotation === "vertical") {
      let x = getXCoord(coord);
      let y = getYCoord(coord);
      markAdjacentTopDown(x, y);
    } else {
      let x = getXCoord(coord);
      let y = getYCoord(coord);
      markAdjacentLeftRight(x, y);
    }
  });
};

const handleAiHitActions = function (hitCoord, destroyed) {
  aiHits.push(hitCoord);
  let x = getXCoord(hitCoord);
  let y = getYCoord(hitCoord);
  if (destroyed) {
    if (partialAiHits.coords.length === 0) {
      //dest size 1
      markAdjacentDiagonals(x, y);
      markAdjacentTopDown(x, y);
      markAdjacentLeftRight(x, y);
      partialAiHits.reset();
      return;
    } else {
      partialAiHits.coords.push(hitCoord);
      if (partialAiHits.coords.length === 2) {
        determineRotation();
      }
      markAdjacentDiagonals(x, y);
      eliminateLast2();
      partialAiHits.reset();
    }
  } else {
    partialAiHits.coords.push(hitCoord);
    markAdjacentDiagonals(x, y);
    if (partialAiHits.coords.length === 2) determineRotation();
  }
};

const handleHit = function (hitCoord) {
  let allCoords,
    allShips = [];
  if (onTurn) {
    allCoords = allOccupied;
    allShips = playerShips;
  } else {
    allCoords = allAiOccupied;
    allShips = aiShips;
  }
  const audio = new Audio("hit_shot.wav");
  audio.play();
  allCoords[allCoords.indexOf(hitCoord)].classList.add("hit");
  allShips.forEach(function (ship) {
    if (ship.includes(hitCoord)) {
      const destroyed = ship.every((coord) => coord.classList.contains("hit"));
      hitCoord.style.backgroundColor = "orange";
      if (onTurn) handleAiHitActions(hitCoord, destroyed);
      if (destroyed) {
        //console.log("ship destroyed");
        ship.forEach((coord) => (coord.style.backgroundColor = "red"));
        const allDestroyed = allCoords.every((coord) =>
          coord.classList.contains("hit")
        );
        if (allDestroyed) {
          gameOver = true;
          if (onTurn) {
            resultInfo.textContent = "YOU LOSE!!!";
            resultInfo.style.backgroundColor = "red";
          } else {
            setTimeout(function () {
              resultInfo.textContent = "YOU WIN";
              resultInfo.style.backgroundColor = "green";
              const winSound = new Audio("win.wav");
              winSound.play();
            }, 1500);
          }

          //console.log("you won the game");
        }
      }
    }
  });
};

const handlePlayerGuess = function (e) {
  if ((onTurn != 0 && playerShips != 7) || gameOver) {
    //console.log("not player turn");
    return;
  }
  if (e.target.classList.contains("ai_coordinate") === false) return;
  const hitCoord = e.target;
  if (allAiOccupied.includes(hitCoord)) {
    if (hitCoord.classList.contains("hit")) return;
    handleHit(hitCoord);
    playerGuesses.push(hitCoord);
    lastHighlighted = [];
  } else {
    onTurn = 1;
    aiGridName.style.backgroundColor = "green";
    playerGridName.style.backgroundColor = "";
    const audio = new Audio("miss_shot.wav");
    audio.play();
    console.log("miss");
    playerGuesses.push(hitCoord);
    hitCoord.style.backgroundColor = "black";
    lastHighlighted = [];
  }
};

const handleAiGridMouseover = function (e) {
  const coord = e.target;

  if (
    lastHighlighted.length > 0 &&
    lastHighlighted[0].classList.contains("player_coordinate") === false
  ) {
    lastHighlighted[0].style.backgroundColor = "rgba(110, 145, 145, 0.377)";
  }

  lastHighlighted = [];
  if (playerGuesses.includes(coord)) return;

  coord.style.backgroundColor = "rgba(0, 95, 130, 0.5)";
  lastHighlighted.push(coord);
};

const updateAiGridOnMouseout = function (e) {
  if (
    e.toElement.classList.contains("ai_coordinate") == false &&
    lastHighlighted.length > 0
  ) {
    lastHighlighted[0].style.backgroundColor = "rgba(110, 145, 145, 0.377)";
  }
};
aiGridEl.addEventListener("mouseout", updateAiGridOnMouseout);
aiGridEl.addEventListener("click", handlePlayerGuess);
aiGridEl.addEventListener("mouseover", handleAiGridMouseover);
