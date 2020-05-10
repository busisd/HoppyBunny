// //Create a Pixi Application
// let app = new PIXI.Application({width: 400, height: 400});

// //Add the canvas that Pixi automatically created for you to the HTML document
// document.body.appendChild(app.view);

// ********************
// Copied from https://pixijs.io/examples/#/demos-basic/container.js
// ********************

const app = new PIXI.Application({
  width: 400,
  height: 600,
  backgroundColor: 0x1099bb,
  // resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

// Create a new texture
const texture = PIXI.Texture.from("assets/bunny.png");

function updateVal(val, maxVal, change) {
  if (val + change >= maxVal) {
    return maxVal;
  } else {
    return val + change;
  }
}

const isUndefined = (obj) => obj === undefined;

class HoppyPlayer {
  constructor(xStart, yStart) {
    this.x = xStart;
    this.y = yStart;
    this.yVelocity = 0;
    this.maxYVelocity = 16;
    this.yAcceleration = 0.45;
    this.yVelocityOnClick = -8;
    this.height = 52;
    this.width = 56;
    this.tilt = 0;
    this.maxTilt = 0.3;
    this.tiltVelocity = 0.02;
    this.corners = [
      [-this.width / 2, 0],
      [0, 0],
      [0, -this.height / 2],
      [this.width / 2 - 6, -this.height / 2],
      [this.width / 2 - 6, this.height / 2],
      [-this.width / 2, this.height / 2],
    ];
  }

  reset(xStart, yStart) {
    this.x = xStart;
    this.y = yStart;
    this.yVelocity = 0;
    this.tilt = 0;
  }

  update(delta) {
    this.y += this.yVelocity * delta;
    this.yVelocity = updateVal(
      this.yVelocity,
      this.maxYVelocity,
      this.yAcceleration * delta
    );

    this.tilt = (this.yVelocity / 8) * 0.3;
  }
}

class HoppyPipe {
  constructor(x, width, holeHeight) {
    this.x = x;
    this.width = width;
    this.topHeight = holeHeight;
    this.bottomHeight = holeHeight + 150;
    this.topSprite = 0;
    this.bottomSprite = 0;
  }

  update(delta) {
    this.x -= 3 * delta;
  }
}

const rotateVector = (vector, sinTheta, cosTheta) => [
  cosTheta * vector[0] - sinTheta * vector[1],
  sinTheta * vector[0] + cosTheta * vector[1],
];

class HoppyGame {
  constructor() {
    this.GAME_WIDTH = 400;
    this.GAME_HEIGHT = 600;
    this.PLAYER_WIDTH = 56;
    this.PLAYER_HEIGHT = 52;
    this.GROUND_HEIGHT = 550;
    this.PIPE_WIDTH = 100;
    this.PIPE_HOLE_HEIGHT = 150;
    this.player = new HoppyPlayer(100, 100);
    this.pipes = [];
    this.isGameOver = false;
    this.score = 0;
    this.highScore = 0;

    this.addPipe(this.GAME_WIDTH);
    this.addPipe(this.GAME_WIDTH + (this.GAME_WIDTH + this.PIPE_WIDTH) / 2);
  }

  resetGame() {
    this.pipes = [];
    this.isGameOver = false;
    this.player.reset(100, 100);
    this.addPipe(this.GAME_WIDTH);
    this.addPipe(this.GAME_WIDTH + (this.GAME_WIDTH + this.PIPE_WIDTH) / 2);
    this.score = 0;
  }

  registerListeners() {
    window.addEventListener("keydown", this.checkValidKey.bind(this), false);
    window.addEventListener("pointerdown", this.onTap.bind(this), false);
  }

  addPipe(newX) {
    this.pipes.push(
      new HoppyPipe(
        newX,
        this.PIPE_WIDTH,
        Math.random() * (this.GROUND_HEIGHT - this.PIPE_HOLE_HEIGHT - 20) + 10
      )
    );
  }

  update(delta) {
    if (!this.isGameOver) {
      this.player.update(delta);
      for (let pipe of this.pipes) {
        pipe.update(delta);
      }

      if (this.pipes[0] && this.pipes[0].x < -this.PIPE_WIDTH) {
        this.pipes = this.pipes.slice(1);
        this.addPipe(this.GAME_WIDTH);
        this.score++;
        if (this.score > this.highScore) this.highScore = this.score;
      }

      this.isGameOver = this.checkCollisions();
    }
  }

  checkCollisions() {
    let corners = this.getPlayerCorners();

    let minX, minY, maxX, maxY;
    for (let i = 0; i < corners.length; i++) {
      if (isUndefined(minX) || corners[i][0] < minX) minX = corners[i][0];
      if (isUndefined(minY) || corners[i][1] < minY) minY = corners[i][1];
      if (isUndefined(maxX) || corners[i][0] > maxX) maxX = corners[i][0];
      if (isUndefined(maxY) || corners[i][1] > maxY) maxY = corners[i][1];
    }

    if (maxY > this.GROUND_HEIGHT) {
      return true;
    }

    for (let pipe of this.pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + pipe.width;
      if (
        maxX > pipeLeft &&
        minX < pipeRight &&
        (minY < pipe.topHeight || maxY > pipe.bottomHeight)
      ) {
        for (let corner of corners) {
          if (
            corner[0] > pipe.x &&
            corner[0] < pipe.x + pipe.width &&
            (corner[1] < pipe.topHeight || corner[1] > pipe.bottomHeight)
          )
            return true;
        }
      }
    }

    return false;
  }

  getPlayerCorners() {
    let sinTilt = Math.sin(this.player.tilt);
    let cosTilt = Math.cos(this.player.tilt);

    return this.player.corners
      .map((corner) => rotateVector(corner, sinTilt, cosTilt))
      .map((vector) => [vector[0] + this.player.x, vector[1] + this.player.y]);
  }

  checkValidKey(e) {
    if (e.key == " ") {
      onTap();
    }
  }

  onTap() {
    if (!this.isGameOver) {
      this.player.yVelocity = this.player.yVelocityOnClick;
    } else {
      this.resetGame();
    }
  }
}

// app.stage.addChild(bun);

class HoppyView {
  constructor(newGame) {
    this.game = newGame;

    this.playerSprite = new PIXI.Sprite(texture);
    this.playerSprite.anchor.set(0.5);
    app.stage.addChild(this.playerSprite);

    this.groundGraphics = new PIXI.Graphics();
    this.groundGraphics.lineStyle(0, 0xff0000);
    this.groundGraphics.beginFill(0x006600);
    this.groundGraphics.drawRect(
      0,
      this.game.GROUND_HEIGHT,
      this.game.GAME_WIDTH,
      this.game.GAME_HEIGHT - this.game.GROUND_HEIGHT
    );
    app.stage.addChild(this.groundGraphics);

    this.pipeGraphics = new PIXI.Graphics();
    app.stage.addChild(this.pipeGraphics);

    this.displayedScore = this.game.score;
    this.displayedHighScore = this.game.highScore;
    this.textDisplay = new PIXI.Text("Score: "+this.displayedScore+"\nHigh Score: "+this.displayedHighScore, {align: 'right'});
    this.textDisplay.x = this.game.GAME_WIDTH - this.textDisplay.width - 5;
    app.stage.addChild(this.textDisplay);

    this.testGraphics = new PIXI.Graphics();
    app.stage.addChild(this.testGraphics);
  }

  drawPipe(pipe) {
    this.pipeGraphics.drawRect(pipe.x, 0, pipe.width, pipe.topHeight);
    this.pipeGraphics.drawRect(
      pipe.x,
      pipe.bottomHeight,
      pipe.width,
      this.game.GROUND_HEIGHT - pipe.bottomHeight
    );
  }

  draw() {
    this.playerSprite.x = this.game.player.x;
    this.playerSprite.y = this.game.player.y;
    this.playerSprite.rotation = this.game.player.tilt;

    this.pipeGraphics.clear();
    this.pipeGraphics.lineStyle(0, 0xff0000);
    this.pipeGraphics.beginFill(0x00bb00);
    for (let pipe of this.game.pipes) {
      this.drawPipe(pipe);
    }

    if (this.game.score != this.displayedScore) {
      this.displayedScore = this.game.score;
      this.displayedHighScore = this.game.highScore;
      this.textDisplay.text = "Score: "+this.displayedScore+"\nHigh Score: "+this.displayedHighScore
      this.textDisplay.x = this.game.GAME_WIDTH - this.textDisplay.width - 5;
    }

    if (false) {
      let corners = this.game.getPlayerCorners();
      this.testGraphics.clear();
      this.testGraphics.lineStyle(0, 0xff0000);
      this.testGraphics.beginFill(0xff0000);
      for (let corner of corners) {
        this.testGraphics.drawCircle(corner[0], corner[1], 1);
      }

      this.testGraphics.drawCircle(100, 550, 3);

      for (let pipe of this.game.pipes) {
        this.testGraphics.drawCircle(pipe.x, pipe.topHeight, 2);
        this.testGraphics.drawCircle(pipe.x + pipe.width, pipe.topHeight, 2);
        this.testGraphics.drawCircle(pipe.x, pipe.bottomHeight, 2);
        this.testGraphics.drawCircle(pipe.x + pipe.width, pipe.bottomHeight, 2);
      }
    }
  }
}

const theGame = new HoppyGame();
theGame.registerListeners();
const theView = new HoppyView(theGame);

app.ticker.add((delta) => {
  theGame.update(delta);
  theView.draw();
});
