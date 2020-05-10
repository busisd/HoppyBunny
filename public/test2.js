// //Create a Pixi Application
// let app = new PIXI.Application({width: 400, height: 400});

// //Add the canvas that Pixi automatically created for you to the HTML document
// document.body.appendChild(app.view);

// ********************
// Copied from https://pixijs.io/examples/#/demos-basic/container.js
// ********************

const app = new PIXI.Application({
  width: 600,
  height: 600,
  backgroundColor: 0x1099bb,
  resolution: window.devicePixelRatio || 1,
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
  maxYVelocity: 99,
  yAcceleration: 0.25,
  height: 52,
  width: 56,
  tilt: 0,
  maxTilt: 0.3,
  tiltVelocity: 0.02,
};
const GROUND_HEIGHT = app.renderer.height;
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
  player.tilt = player.yVelocity/8*.3;
  player.sprite.rotation = player.tilt;

  testPlayerBounds();
}

function testPlayerBounds() {
  // if (player.y + player.height / 2 > GROUND_HEIGHT) {
  //   isGameOver = true;
  // }
  if (bun.getBounds().bottom > GROUND_HEIGHT) {
    isGameOver = true;
  }
}

// Listen for animate update
app.ticker.add((delta) => {
  if (!isGameOver) {
    updatePlayer(delta);
  }
});

window.addEventListener("keydown", checkValidKey, false);
window.addEventListener("mousedown", onTap, false);

function checkValidKey(e) {
  if (e.key == " ") {
    onTap();
  }
}

function onTap() {
  player.yVelocity = -6;
  player.tilt = -.3;
}
