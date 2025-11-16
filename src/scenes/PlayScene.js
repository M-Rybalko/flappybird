import BaseScene from './BaseScene';

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene  {

  constructor(config) {
    super('PlayScene', config);
    this.bird = null;
    this.pipes = null;
    this.isPaused = false;

    this.pipeHorizontalDistance = 0;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [500, 550];
    this.flapVelocity = 275;

    this.score = 0;
    this.scoreText = '';
    this.highScoreText = '';
  }

  create = () => {
    super.create();
    this.addBird();
    this.addPipes();
    this.createColliders();
    this.createScore();
    this.createPause()
    this.handleInputs();
    this.listenToEvents();
  }

  addBg = () => {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  addBird = () => {
    this.bird = this.physics.add.sprite(this.config.birdPos.x, this.config.birdPos.y, 'bird').setOrigin(0);
    this.bird.body.gravity.y = 400;
    this.bird.setCollideWorldBounds(true);
  }

  addPipes = () => {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'upperPipe')      
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe')        
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe)
    }

    this.pipes.setVelocityX(-200);
  }

  createColliders = () => {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore = () => {
    this.score = 0;
    const highScore = localStorage.getItem('highScore');
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, { fontSize: '32px', fill: '#000'});
    this.highScoreText = this.add.text(16, 52, `High score: ${highScore || 0}`, { fontSize: '18px', fill: '#000'});
  }

  createPause = () => {
    this.isPaused = false;
    const pauseButton = this.add.image(this.config.width - 10, this.config.height -10, 'pause')
      .setInteractive()
      .setScale(3)
      .setOrigin(1)

    pauseButton.on('pointerdown', () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    })
  }

  handleInputs = () => {
    this.input.on('pointerdown', this.flap);
    this.input.keyboard.on('keydown-SPACE', this.flap);
  }

  update = (time, delta) => {
    this.checkGameOver();
    this.reusePipes();
  }

  checkGameOver = () => {
    if (this.bird.getBounds().bottom >= this.config.height || this.bird.getBounds().top <= 0) {
      this.gameOver();
    }
  }

  listenToEvents = () => {
    if (this.pauseEvent) return;

    this.pauseEvent = this.events.on('resume', () => {
      this.initialTime = 3;
      this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true
      })
    })
  }

   countDown = () => {
    this.initialTime--;
    this.countDownText.setText('Fly in: ' + this.initialTime);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText('');
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  gameOver = () => {
    this.physics.pause();
    this.bird.setTint(0xEE4824);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false
    })
  }

  flap = () => {
    if (this.isPaused) return;
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  placePipe = (uPipe, lPipe) => {
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;
    uPipe.body.setSize(uPipe.width - 25, uPipe.height);

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance
    lPipe.body.setSize(lPipe.width - 25, lPipe.height);
  }

  getRightMostPipe = () => {
    let rightMostX = 0;

    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    })

    return rightMostX;
  }

  reusePipes = () => {
    const tempPipes = [];
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.saveHighScore();
        }
      }
    })
  }

   saveHighScore = () => {
    const highScoreText = localStorage.getItem('highScore');
    const highScore = highScoreText && parseInt(highScoreText, 10);

    if (!highScore || this.score > highScore) {
      this.highScoreText.setText(`High score: ${this.score}`)
      localStorage.setItem('highScore', this.score);
    }
  }


  increaseScore = () => {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`)
  }
}

export default PlayScene;