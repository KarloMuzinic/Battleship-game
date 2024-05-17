"use strict";

const playerGridEl = document.querySelector(".player_grid");
const aiGridEl = document.querySelector(".ai_grid");
const playerGridName = document.querySelector(".player_grid_name");
const aiGridName = document.querySelector(".ai_grid_name");
const resultInfo = document.querySelector(".result_info");
let playerCoordsArray = [];
let aiCoordsArray = [];
const playerGuesses = [];
const playerHits = [];
let playerShips = [];
let gameOver = false;
const initializeGrids = function () {
  let y = -1;

  for (let i = 0; i < 100; i++) {
    if (i % 10 === 0) y++;

    const newEl = document.createElement("button");
    newEl.classList.add(`coordinate`);
    newEl.classList.add(`player_coordinate`);
    newEl.setAttribute("id", `${i}`);
    newEl.classList.add(`x_${i % 10}`);
    newEl.classList.add(`y_${y}`);
    playerGridEl.appendChild(newEl);
    playerCoordsArray.push(newEl);
  }

  y = -1;
  for (let i = 100; i < 200; i++) {
    if (i % 10 === 0) y++;

    const newEl = document.createElement("button");
    newEl.classList.add(`coordinate`);
    newEl.classList.add(`ai_coordinate`);
    newEl.setAttribute("id", `${i}`);
    newEl.classList.add(`x_${i % 10}`);
    newEl.classList.add(`y_${y}`);
    aiGridEl.appendChild(newEl);
    aiCoordsArray.push(newEl);
  }
};

window.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);

let rotation = "vertical";

//let lastMouseOver = { style: { backgroundColor: "black" } };

let allOccupied = [];
let allSurroundingOccupied = [];
let toHighlight = [];
//player info
let acLeft,
  batLeft,
  cruLeft = 1;
let desLeft,
  subLeft = 2;
//////

const selectedShip = {
  ac: 1,
  bat: 1,
  cru: 1,
  des: 2,
  sub: 2,
  currentlySelected: "",
};

initializeGrids();

const markTheCoord = function (e) {
  if (e.target.classList.contains("grid")) return;
  if (selectedShip[selectedShip.currentlySelected] === 0) return;
  if (selectedShip.currentlySelected && isValidPlacementArea) {
    let ship = [];
    toHighlight.forEach(function (coord) {
      ship.push(coord);
      coord.classList.add("player_occupied");
      coord.style.backgroundColor = "green";
      if (allOccupied.includes(coord) === false) {
        allOccupied.push(coord);
        markSurroundingOccupied(coord);
      }
    });
    playerShips.push(ship);
    selectedShip[selectedShip.currentlySelected]--;
    document.querySelector(
      `.${selectedShip.currentlySelected}`
    ).textContent = `${selectedShip[selectedShip.currentlySelected]}x`;
    if (playerShips.length === 7) {
      startGuessingStage();
    }
  }
};

const markSurroundingOccupied = function (coord) {
  const x = getXCoord(coord);
  const y = getYCoord(coord);
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
          allSurroundingOccupied.push(playerCoordsArray[occX]);
        } else {
          allSurroundingOccupied.push(playerCoordsArray[occY * 10 + occX]);
        }
      }
    }
  }
};

const getXCoord = function (coord) {
  let x = "";
  x = coord.classList.value;

  const i = x.indexOf(" x_");
  x = x.substring(i + 3, i + 4);
  return Number(x);
};
const getYCoord = function (coord) {
  let y = "";
  y = coord.classList.value;

  const i = y.indexOf(" y_");
  y = y.substring(i + 3, i + 4);
  return Number(y);
};

playerGridEl.addEventListener("click", markTheCoord);

const deselect = function (e) {
  if (e.button === 2) {
    selectedShip.currentlySelected = "";
    toHighlight.forEach(function (coord) {
      if (allOccupied.includes(coord) === false)
        coord.style.backgroundColor = "rgba(110, 145, 145, 0.377)";
    });
  }
};

const markCoordWithX = function (e) {
  //or remove X
  if (e.button === 2) {
    e.target.textContent = e.target.textContent === "" ? "X" : "";
  }
};

playerGridEl.addEventListener("mousedown", deselect);
aiGridEl.addEventListener("mousedown", markCoordWithX);

const rotate = function (e) {
  rotation === "vertical" ? (rotation = "horizontal") : (rotation = "vertical");
  if (e.path[0].classList.contains("coordinate")) {
    lastHighlighted.forEach(
      (coord) => (coord.style.backgroundColor = "rgba(110, 145, 145, 0.377)")
    );
    lastHighlighted = [];

    updateOnMouseover(e);
  }
};

document.body.addEventListener("wheel", rotate);

const updateOnMouseover = function (e) {
  if (
    selectedShip.currentlySelected == "" ||
    selectedShip[selectedShip.currentlySelected] === 0
  )
    handleNoShipSelected(e);
  else handleShipSelected(e);
};

const updateOnMouseout = function (e) {
  if (e.toElement.classList.contains("player_coordinate") == false) {
    playerCoordsArray.forEach(function (coord) {
      if (
        allOccupied.includes(coord) === false &&
        aiGuesses.includes(coord) === false
      )
        coord.style.backgroundColor = "rgba(110, 145, 145, 0.377)";
    });
  }
};

playerGridEl.addEventListener("mouseover", updateOnMouseover);
playerGridEl.addEventListener("mouseout", updateOnMouseout);

const player_table_buttons = document.querySelectorAll(".table_button");
player_table_buttons.forEach(function (button) {
  button.addEventListener("click", function (e) {
    selectedShip.currentlySelected = e.target.classList.value.substring(
      e.target.classList.value.indexOf(" ") + 1
    );
    //console.log(selectedShip.currentlySelected);
  });
});

//old

/*const handleNoShipSelected = function (e) {
  playerGridEl.style.backgroundColor = "white";
  if (aiGuesses.includes(e.target)) {
    if (allOccupied.includes(lastMouseOver) === false) {
      lastMouseOver.style.backgroundColor = "rgba(110, 145, 145, 0.377)";
    }
    return;
  }
  if (e.target.classList.contains("grid")) {
    if (allOccupied.includes(lastMouseOver) == false)
      lastMouseOver.style.backgroundColor = "rgba(110, 145, 145, 0.377)";
    lastMouseOver = e.target;
    playerGridEl.style.backgroundColor = "white";
    return;
  }
  if (allOccupied.includes(e.target)) {
    if (allOccupied.includes(lastMouseOver) == false)
      lastMouseOver.style.backgroundColor = "rgba(110, 145, 145, 0.377)";
    lastMouseOver = e.target;
    playerGridEl.style.backgroundColor = "white";
    return;
  }
  if (allOccupied.includes(lastMouseOver) == false) {
    lastMouseOver.style.backgroundColor = "rgba(110, 145, 145, 0.377)";
    e.target.style.backgroundColor = "rgba(0, 95, 130, 0.5)";
    lastMouseOver = e.target;
    playerGridEl.style.backgroundColor = "white";
    return;
  }
  e.target.style.backgroundColor = "rgba(0, 95, 130, 0.5)";
  lastMouseOver = e.target;
  playerGridEl.style.backgroundColor = "white";
};*/

let isValidPlacementArea = true;
let lastHighlighted = [];

const highlightCoords = function (toHighlight) {
  toHighlight.forEach(function (coord) {
    if (isValidPlacementArea) {
      coord.style.backgroundColor = "rgba(0, 95, 130, 0.5)";
    } else {
      coord.style.backgroundColor = "red";
    }

    lastHighlighted.push(coord);
  });
};
//////////////////////////////////////////////////
const handleNoShipSelected = function (e) {
  const coord = e.target;

  if (
    lastHighlighted.length > 0 &&
    lastHighlighted[0].classList.contains("ai_coordinate") === false &&
    lastHighlighted[0].classList.contains("player_occupied") === false
  ) {
    lastHighlighted[0].style.backgroundColor = "rgba(110, 145, 145, 0.377)";
  }
  lastHighlighted = [];
  if (allOccupied.includes(coord) || aiGuesses.includes(coord)) return;

  coord.style.backgroundColor = "rgba(0, 95, 130, 0.5)";
  lastHighlighted.push(coord);
};

/////////////////////////////////////////////////
const handleShipSelected = function (e) {
  toHighlight = [];
  isValidPlacementArea = true;
  lastHighlighted.forEach(function (coord) {
    if (allOccupied.includes(coord) === false)
      coord.style.backgroundColor = "rgba(110, 145, 145, 0.377)";
  });
  lastHighlighted = [];
  if (e.target.classList.contains("grid")) return;
  let currentCoord = e.target;
  let i,
    ceiling,
    step = 0;
  step = rotation === "vertical" ? 10 : 1;

  switch (selectedShip.currentlySelected) {
    case "ac":
      if (rotation === "vertical") {
        i = Number(currentCoord.id) - 20;
        ceiling = Number(currentCoord.id) + 21;
      } else {
        i = Number(currentCoord.id) - 2;
        ceiling = Number(currentCoord.id) + 3;
      }
      break;

    case "bat":
      if (rotation === "vertical") {
        i = Number(currentCoord.id) - 10;
        ceiling = Number(currentCoord.id) + 21;
      } else {
        i = Number(currentCoord.id) - 1;
        ceiling = Number(currentCoord.id) + 3;
      }
      break;

    case "cru":
      if (rotation === "vertical") {
        i = Number(currentCoord.id) - 10;
        ceiling = Number(currentCoord.id) + 11;
      } else {
        i = Number(currentCoord.id) - 1;
        ceiling = Number(currentCoord.id) + 2;
      }
      break;

    case "des":
      if (rotation === "vertical") {
        i = Number(currentCoord.id);
        ceiling = Number(currentCoord.id) + 11;
      } else {
        i = Number(currentCoord.id);
        ceiling = Number(currentCoord.id) + 2;
      }
      break;

    case "sub":
      if (rotation === "vertical") {
        i = Number(currentCoord.id);
        ceiling = Number(currentCoord.id) + 1;
      } else {
        i = Number(currentCoord.id);
        ceiling = Number(currentCoord.id) + 1;
      }
      break;
  }

  while (i < ceiling) {
    const checkHor =
      rotation === "horizontal" &&
      Math.floor(currentCoord.id / 10) !== Math.floor(i / 10);
    if (
      i < 0 ||
      i > 99 ||
      allOccupied.includes(playerCoordsArray[i]) ||
      checkHor
    ) {
      isValidPlacementArea = false;
    } else {
      if (allSurroundingOccupied.includes(playerCoordsArray[i]))
        isValidPlacementArea = false;
      toHighlight.push(playerCoordsArray[i]);
    }
    i += step;
  }
  highlightCoords(toHighlight);
};
