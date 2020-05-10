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

const bun = new PIXI.Sprite(texture);
bun.x = 100;
bun.y = 100;
bun.anchor.set(0.5);
// bun.tint = 0xFFAAAA;
app.stage.addChild(bun);

const player = {
  sprite: bun,
  y: 100,
  yVelocity: 0,
  maxYVelocity: 16,
  yAcceleration: 0.45,
  yVelocityOnClick: -8,
  height: 52,
  width: 56,
  tilt: 0,
  maxTilt: 0.3,
  tiltVelocity: 0.02,
};
const GROUND_HEIGHT = app.renderer.height - 50;
var isGameOver = false;

function updateVal(val, maxVal, change) {
  if (val + change >= maxVal) {
    return maxVal;
  } else {
    return val + change;
  }
}

function updatePlayer(delta) {
  player.y += player.yVelocity * delta;
  player.yVelocity = updateVal(
    player.yVelocity,
    player.maxYVelocity,
    player.yAcceleration * delta
  );
  player.sprite.y = Math.round(player.y);

  // player.tilt = updateVal(
  //   player.tilt,
  //   player.maxTilt,
  //   player.tiltVelocity * delta
  // );
  player.tilt = (player.yVelocity / 8) * 0.3;
  player.sprite.rotation = player.tilt;

  isGameOver = testPlayerBounds();
}



var groundGraphics = new PIXI.Graphics();
groundGraphics.lineStyle(0, 0xff0000);
groundGraphics.beginFill(0x006600);
groundGraphics.drawRect(
  0,
  GROUND_HEIGHT,
  app.renderer.width,
  app.renderer.height - GROUND_HEIGHT
);
app.stage.addChild(groundGraphics);



const allPipes = [];


function createPipe() {
  let newHeight = Math.round(Math.random()*(GROUND_HEIGHT-150-10))+10;
  const newPipe = {
    x: app.renderer.width,
    width: 100,
    topHeight: newHeight,
    bottomHeight: newHeight+150,
    topSprite: 0,
    bottomSprite: 0,
  };
  
  const newPipeContainer = new PIXI.Container();
  newPipeContainer.x = newPipe.x;
  app.stage.addChild(newPipeContainer);

  newPipe.container = newPipeContainer;

  var pipeGraphics = new PIXI.Graphics();
  newPipeContainer.addChild(pipeGraphics);
  pipeGraphics.lineStyle(0, 0xff0000);
  pipeGraphics.beginFill(0x00bb00);
  pipeGraphics.drawRect(
    0,
    0,
    newPipe.width,
    newPipe.topHeight
  );
  pipeGraphics.drawRect(
    0,
    newPipe.bottomHeight,
    newPipe.width,
    GROUND_HEIGHT - newPipe.bottomHeight
  );
  
  allPipes.push(newPipe);
}

createPipe();

function testPlayerBounds() {
  // if (player.y + player.height / 2 > GROUND_HEIGHT) {
  //   isGameOver = true;
  // }
  const { left, right, top, bottom } = player.sprite.getBounds();
  if (bottom > GROUND_HEIGHT) {
    return true;
  }

  // player.sprite.calculateVertices();
  const vertices = player.sprite.vertexData;
  for (pipe of allPipes) {
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x+pipe.width;
    if (
      right > pipeLeft &&
      left < pipeRight &&
      (top < pipe.topHeight || bottom > pipe.bottomHeight)
    ) {
      if (top < pipe.topHeight) {
        for (let i = 0; i < 4; i += 2) {
          if (
            vertices[i + 1] < pipe.topHeight &&
            vertices[i] > pipeLeft &&
            vertices[i] < pipeRight
          )
            return true;
        }
      } else {
        for (let i = 0; i < 4; i += 2) {
          if (
            vertices[i + 1] + player.height > pipe.bottomHeight &&
            vertices[i] > pipeLeft &&
            vertices[i] < pipeRight
          )
            return true;
        }
      }
    }
  }

  return false;
}

function updatePipe(pipe, delta) {
  pipe.x -= 3 * delta;
  pipe.container.x = Math.round(pipe.x);
  if (pipe.x < -100) {
    app.stage.removeChild(pipe);
    allPipes.pop();
    createPipe();
  }
}

// Listen for animate update
app.ticker.add((delta) => {
  if (!isGameOver) {
    updatePlayer(delta);
    
    for (pipe of allPipes) {
      updatePipe(pipe, delta);
    }
  }
});

window.addEventListener("keydown", checkValidKey, false);
window.addEventListener("pointerdown", onTap, false);

function checkValidKey(e) {
  if (e.key == " ") {
    onTap();
  }
}

function onTap() {
  player.yVelocity = player.yVelocityOnClick;
}
