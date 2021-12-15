class GameBoard {
  #boardDiv;

  #boardArray;

  constructor(player) {
    this.#boardDiv = document.querySelector(`.${player}`);
    this.#boardArray = document.querySelectorAll(`${player} > div`);
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
      this.#boardDiv.appendChild(board);
    }
  }
}

export default GameBoard;
