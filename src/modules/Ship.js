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

export default Ship;
