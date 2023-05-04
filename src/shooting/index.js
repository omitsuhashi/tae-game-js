let ship;
let background;
let timer = 0;
let enemies = [];

const WIDTH = 1200;
const HEIGHT = 720;
const IMG_BACKGROUND = 0;
const IMG_SHIP = 1;
const IMG_MISSILE = 2;
const IMG_ENEMY_MISSILE_1 = 4;
const IMG_ENEMY_1 = 5;

class Background {
  x = 0;

  constructor(width, speed) {
    this.width = width;
    this.speed = speed;
  }

  draw() {
    this.x = (this.x - this.speed) % this.width;
    drawImg(IMG_BACKGROUND, this.x, 0);
    drawImg(IMG_BACKGROUND, this.width+this.x, 0);
  }
}

class GameObjectBase {
  constructor(imageId, x, y, xp, yp, life = 1) {
    this.imageId = imageId;
    this.x = x;
    this.y = y;
    this.xp = xp;
    this.yp = yp;
    this.life = life;
    const image = img[imageId]
    this.width = image.width;
    this.height = image.height;
    // this.centerX = Math.ceil(this.width / 2);
    // this.centerY = Math.ceil(this.height / 2);
  }
}

class EnemyObject extends GameObjectBase {
  constructor(imageId, x, y, xp, yp) {
    super(imageId, x, y, xp, yp);
  }

  move() {
    this.x += this.xp;
    this.y += this.yp;
    drawImgC(this.imageId, this.x, this.y);
    return this.x < 0;
  }
}

class Ship extends GameObjectBase {
  missiles = [];

  constructor() {
    super(IMG_SHIP,400, 360, 20, 20);
  }

  move() {
    if(key[37] > 0 && this.x > 60) this.x -= this.xp;
    if(key[39] > 0 && this.x < 1000) this.x += this.xp;
    if(key[38] > 0 && this.y > 40) this.y -= this.yp;
    if(key[40] > 0 && this.y < 680) this.y += this.yp;
    if(key[32] === 1) {
      key[32]++;
      this.shoot();
    }
    drawImgC(this.imageId, this.x, this.y);
    this.moveMissile();
  }

  moveMissile() {
    const removeMissileIndex = [];
    this.missiles.forEach((value, idx) => {
      const disabled = value.move();
      if (disabled) removeMissileIndex.push(idx);
    })
    this.missiles = this.missiles.filter((value, idx) => !(idx in removeMissileIndex));
  }

  shoot() {
    const missile = new Missile(IMG_MISSILE, this.x + this.width, this.y, 40, 0);
    this.missiles.push(missile);
  }
}


class EnemyShip1 extends EnemyObject {
  missiles = [];
  constructor(x, y) {
    super(IMG_ENEMY_1, x, y, -12, 0);
  }

  move() {
    const passed = super.move();
    this.moveMissile();
    return passed;
  }

  moveMissile() {
    const removeIndex = [];
    this.missiles.forEach((value, index) => {
      const disabled = value.move();
      if (disabled) removeIndex.push(index);
    })
    this.missiles = this.missiles.filter((value, index) => !(index in removeIndex));
  }

  shoot() {
    const missile = new Missile(IMG_ENEMY_MISSILE_1, this.x, this.y, -24, 0)
    this.missiles.push(missile);
  }
}

class Missile extends GameObjectBase {
  constructor(imageId, x, y, xp, yp) {
    super(imageId, x, y, xp, yp);
  }

  move() {
    this.x += this.xp;
    this.y += this.yp;
    drawImgC(this.imageId, this.x, this.y);
    const disableX = this.xp > 0 ? this.x > WIDTH : this.x < 0;
    const disableY = this.yp > 0 ? this.y > HEIGHT : this.y < 0;
    return disableX || disableY;
  }
}

//起動時の処理
function setup(){
  canvasSize(WIDTH, HEIGHT);
  loadImg(IMG_BACKGROUND, "image/bg.png");
  loadImg(IMG_SHIP, "image/spaceship.png");
  loadImg(IMG_MISSILE, 'image/missile.png');
  loadImg(IMG_ENEMY_MISSILE_1, 'image/enemy0.png');
  loadImg(IMG_ENEMY_1, "image/enemy1.png");
  background = new Background(1200, 1);
  ship = new Ship();
}

//メインループ
function mainloop(){
  timer++;
  background.draw();
  ship.move();
  if (timer % 10 === 0) createEnemies();
  const removeEnemiesIdx = [];
  enemies.forEach((value, index) => {
    const passed = value.move();
    if (rnd(100) < 3) value.shoot();
    if (passed) removeEnemiesIdx.push(index);
  });
  enemies = enemies.filter((value, index) => !(index in removeEnemiesIdx));
}

function createEnemies() {
  const ship1 = Array.from(new Array(rnd(2)), () => new EnemyShip1(WIDTH, rnd(HEIGHT)));
  enemies.push(...ship1);
}
