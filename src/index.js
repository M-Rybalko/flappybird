import '../styles.css'
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: {
    preload,
    create,
    update,
  }
};

const FLAP_VELOCITY = 275;
const BIRD_INIT_POS = { 
  x: config.width * 0.1, 
  y: config.height / 2 
}
let bird = null;

new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
}

function create () {
  this.add.image(0, 0, 'sky').setOrigin(0);
  bird = this.physics.add.sprite(BIRD_INIT_POS.x, BIRD_INIT_POS.y, 'bird').setOrigin(0);

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown-SPACE', flap);
}

function update(time, delta) {
  if (bird.y > config.height - bird.height || bird.y < 0) {
    restart();
  }
}

function restart() {
  bird.x = BIRD_INIT_POS.x;
  bird.y = BIRD_INIT_POS.y;
  
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -FLAP_VELOCITY;
}