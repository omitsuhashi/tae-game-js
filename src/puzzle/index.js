const WIDTH = 920;
const HEIGHT = 1200;

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 12;

const IMG_BG = 0
const IMG_CHARA_TAKO = 1

class Board {
  constructor(width, height) {
    this.arr = [];
    this.width = width;
    this.height = height;
    for (let y = 0; y < height + 1; y++) {
      this.arr[y] = [];
      for (let x = 0; x < width + 1; x++) {
        this.arr[y][x] = x % width === 0 || y % height === 0 ? -1 : 0;
      }
    }
    this.arr[this.height / 2][this.width / 2] = 1;
    console.info(this.arr);
  }

  draw() {
    drawImg(IMG_BG, 0, 0);
    for (let y = 1; y < this.height; y++) {
      for (let x = 1; x < this.width; x++) {
        if (this.arr[y][x] > 0) drawImg(this.arr[y][x], 80 * x, 80 * y);
      }
    }
  }
}

let board;

function setup() {
  canvasSize(WIDTH, HEIGHT);
  loadImg(IMG_BG, 'image/bg.png');
  loadImg(IMG_CHARA_TAKO, 'image/tako.png');
  board = new Board(BOARD_WIDTH, BOARD_HEIGHT);
}

function mainloop() {
  board.draw();
}
