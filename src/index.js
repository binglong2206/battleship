class Ship {
  #length;

  constructor(n) {
    this.#length = n;
  }

  get showLength() {
    return this.#length;
  }

  getHit() {
    this.#length -= 1;
  }

  checkSunk() {
    if (this.#length <= 0) {
      console.log('ur done');
    }
  }
}

class GameBoard {
  #boardDiv;
  #boardArray;

  constructor(player) {
    this.#boardDiv = document.querySelector(`.${player}`);
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
      board.addEventListener('click', this.receiveAttack.bind(board));
      this.#boardDiv.appendChild(board);
    }

    this.#boardArray = Array.from(
      document.querySelectorAll(`div.${this.#boardDiv.className} > div`)
    );
  }

  receiveAttack() {
    const board = this;
    board.classList.add('taken');
  }
}

const board1 = new GameBoard('gameBoard1');
const newShip = new Ship(5);
const newShip2 = new Ship(2);
board1.newBoard();

function setRandomShip(ship) {
  const boardArray = Array.from(
    document.querySelectorAll('div.gameBoard1 > div')
  );

  const length = ship.showLength;
  const direction = Math.floor(Math.random() * 2); // either move right or down
  let startingIndex = Math.floor(Math.random() * 100);
  console.log(direction);
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
    shipPositions.forEach((index) => boardArray[index].classList.add('taken'));
  } else setRandomShip(ship);
}

function checkShipPlacement(shipPositions, boardArray, direction) {
  const midPositions = shipPositions.slice(1, shipPositions.length - 1);

  // Check if position greater than 99
  if (shipPositions[shipPositions.length - 1] > 99) return false;

  // Only check edges if direction is horizontal
  if (direction === 0) {
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
