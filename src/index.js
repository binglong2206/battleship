class Ship {
  #length;
  #name;
  #coordinate = [];
  #sunkCoordinate = [];

  constructor(name, length) {
    this.#name = name;
    this.#length = length;
  }

  get showName() {
    return this.#name;
  }

  get showLength() {
    return this.#length;
  }

  set setCoordinate(c) {
    this.#coordinate = c;
  }

  get showCoordinate() {
    return this.#coordinate;
  }

  checkSunk(boardKey) {
    const indexOf = this.#coordinate.indexOf(boardKey);
    if (indexOf != -1) {
      this.#sunkCoordinate.push(this.#coordinate[indexOf]);
      if (this.#sunkCoordinate.length == this.#coordinate.length) {
        return true;
      }
    }
  }
}

class GameBoard {
  #boardDiv;

  constructor(selectedBoard) {
    this.#boardDiv = document.querySelector(`.${selectedBoard}`);
  }

  newBoard() {
    while (this.#boardDiv.lastChild) {
      this.#boardDiv.removeChild(this.#boardDiv.lastChild);
    }

    for (let i = 0; i < 100; i++) {
      const board = document.createElement('div');
      board.style.width = '50px';
      board.style.height = '50px';
      board.style.border = '1px solid black';
      board.setAttribute('data-key', i);
      board.innerText = i;
      applyBoardDrop(board);

      this.#boardDiv.appendChild(board);
    }
  }

  revealShip(coordinates) {
    console.log(this.boardsArray);
    coordinates.forEach((index) => {
      this.boardsArray[index].classList.add('revealShip');
    });
  }

  receiveAttack(board) {
    if (board.classList.contains('taken')) {
      board.classList.add('successHit');
    } else {
      board.classList.add('missedHit');
      turn = 1;
    }
  }

  get boardsArray() {
    return Array.from(
      document.querySelectorAll(`.${this.#boardDiv.className} > div`)
    );
  }
}

let turn = 0;
let pcShipsObjects;
let playerShipsObjects;

const startGameButton = document.querySelector('.startGame');
startGameButton.addEventListener('click', startGameLogicPVE);

const pcBoard = new GameBoard('gameBoard2');
const playerBoard = new GameBoard('gameBoard1');

pcBoard.newBoard();
playerBoard.newBoard();

generatePCships();
generatePlayerShips();

/**
 *
 * @returns
 */
function generatePCships() {
  const pcShip0 = new Ship('destroyer', 5);
  const pcShip1 = new Ship('submarine', 3);
  const pcShip2 = new Ship('boat', 7);
  const pcShip3 = new Ship('nuke', 3);
  const pcShip4 = new Ship('motorboat', 4);

  const pcShips = [pcShip0, pcShip1, pcShip2, pcShip3, pcShip4];

  pcShips.forEach((ship) => {
    setRandomShip(ship);
  });

  return (pcShipsObjects = pcShips);
}

function setRandomShip(ship) {
  const boardArray = Array.from(
    document.querySelectorAll('div.gameBoard2 > div')
  );

  const length = ship.showLength;
  const direction = Math.floor(Math.random() * 2); // either move right or down
  let startingIndex = Math.floor(Math.random() * 100);

  let shipPositions = [];
  for (let i = 0; i < length; i++) {
    if (direction === 0) {
      shipPositions.push(startingIndex);
      startingIndex++;
    } else if (direction === 1) {
      shipPositions.push(startingIndex);
      startingIndex += 10;
    }
  }

  if (checkShipPlacement(shipPositions, boardArray, direction)) {
    shipPositions.forEach((index) => {
      boardArray[index].classList.add('taken');
      boardArray[index].classList.add(`${ship.showName}`);
    });
    ship.setCoordinate = shipPositions;
  } else setRandomShip(ship);
}

function checkShipPlacement(shipPositions, boardArray, direction) {
  const midPositions = shipPositions.slice(1, shipPositions.length - 1);

  // Check if last position greater than 99
  if (shipPositions[shipPositions.length - 1] > 99) return false;

  // Only check edges if direction is horizontal
  if (direction === 0 || direction != true) {
    if (
      midPositions.some((position) => position % 10 == 0) ||
      midPositions.some((position) => position % 10 == 9)
    ) {
      return false;
    }
  }

  // Check if any of the current board is taken
  for (let i = 0; i < shipPositions.length; i++) {
    if (boardArray[shipPositions[i]].classList.contains('taken')) return false;
  }

  return true;
}

function generatePlayerShips() {
  const standByDiv = document.querySelector('.standByDiv');

  const playerShip0 = new Ship('destroyer', 5);
  const playerShip1 = new Ship('submarine', 3);
  const playerShip2 = new Ship('boat', 7);
  const playerShip3 = new Ship('nuke', 3);
  const playerShip4 = new Ship('motorboat', 4);

  const playerShips = [
    playerShip0,
    playerShip1,
    playerShip2,
    playerShip3,
    playerShip4,
  ];

  playerShips.forEach((ship) => {
    const shipContainer = document.createElement('div');
    shipContainer.classList.add(`${ship.showName}`);
    shipContainer.classList.add('ship');

    for (let i = 0; i < ship.showLength; i++) {
      const shipPart = document.createElement('div');
      shipPart.dataset.key = `${ship.showName}-${i}`;
      shipContainer.appendChild(shipPart);
    }

    applyDragRotate(shipContainer, ship);
    standByDiv.appendChild(shipContainer);
  });

  return (playerShipsObjects = playerShips);
}

let selectedShipObject;
let selectedShipContainer;
let selectedShipPartArray;
let selectedShipPart;
let selectedShipDirection;

function applyDragRotate(shipContainer, ship) {
  // Rotate
  shipContainer.addEventListener('click', () => {
    shipContainer.classList.toggle('verticalShips');
  });

  // Drag Drop
  shipContainer.setAttribute('draggable', true);

  // Storing selected ship information
  shipContainer.addEventListener('mousedown', (e) => {
    let dataAttribute = e.path[0].getAttribute('data-key');
    selectedShipObject = ship;
    selectedShipContainer = shipContainer;
    selectedShipPart = dataAttribute.slice(-1);
    selectedShipPartArray = Array.from(shipContainer.children);
    if (shipContainer.classList.contains('verticalShips')) {
      selectedShipDirection = 1;
    } else selectedShipDirection = 0;
  });
}

function applyBoardDrop(board) {
  board.addEventListener('dragenter', (e) => {
    e.preventDefault();
  });

  board.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  board.addEventListener('drop', (e) => {
    let selectedBoard = parseInt(e.path[0].getAttribute('data-key'));

    setPlayerShip(selectedBoard);
  });
}

function setPlayerShip(selectedBoard) {
  let firstShipBoard;
  let shipPositions = [];
  let shipLength = selectedShipPartArray.length;
  const boardArray = Array.from(document.querySelectorAll('.gameBoard1 > div'));

  // set Coordinates
  if (selectedShipDirection === 0) {
    // If horizontal
    firstShipBoard = selectedBoard - selectedShipPart;
    for (let i = 0; i < shipLength; i++) {
      shipPositions.push(firstShipBoard);
      firstShipBoard++;
    }
  } else {
    // If vertical
    firstShipBoard = selectedBoard - selectedShipPart * 10;
    for (let i = 0; i < shipLength; i++) {
      shipPositions.push(firstShipBoard);
      firstShipBoard += 10;
    }
  }
  if (checkShipPlacement(shipPositions, boardArray, selectedShipDirection)) {
    shipPositions.forEach((index) => {
      boardArray[index].classList.add('taken');
      boardArray[index].classList.add('playerTaken');
      boardArray[index].classList.add(`${selectedShipObject.showName}`);
    });
    selectedShipObject.setCoordinate = shipPositions;
    selectedShipContainer.remove();
  }
}

/**
 *
 * @returns Main PVE Logic
 */
function startGameLogicPVE() {
  if (document.querySelector('.standByDiv').children.length != 0) return;

  pcBoard.boardsArray.forEach((board) => {
    board.addEventListener('click', mainPveLogic);
  });

  function mainPveLogic(e) {
    const board = this;
    const boardIndex = parseInt(board.getAttribute('data-key'));

    if (
      turn != 0 ||
      board.classList.contains('missedHit') ||
      board.classList.contains('successHit')
    )
      return;

    pcBoard.receiveAttack(board);

    pcShipsObjects.forEach((ship) => {
      if (ship.checkSunk(boardIndex)) {
        pcBoard.revealShip(ship.showCoordinate);
      }
    });

    if (turn === 1) easyAiAttack();
  }
}

function easyAiAttack() {
  let playerBoards = playerBoard.boardsArray;
  let randomIndex = Math.floor(Math.random() * 100);

  while (
    playerBoards[randomIndex].classList.contains('missedHit') ||
    playerBoards[randomIndex].classList.contains('successHit')
  ) {
    randomIndex = Math.floor(Math.random() * 100);
  }

  playerShipsObjects.forEach((ship) => {
    if (ship.checkSunk(randomIndex)) {
      playerBoard.revealShip(ship.showCoordinate);
    }
  });

  if (playerBoards[randomIndex].classList.contains('taken')) {
    playerBoards[randomIndex].classList.add('successHit');
    easyAiAttack();
  } else {
    playerBoards[randomIndex].classList.add('missedHit');
    turn = 0;
  }
}
