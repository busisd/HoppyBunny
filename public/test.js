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

const container = new PIXI.Container();

app.stage.addChild(container);

// Create a new texture
const texture = PIXI.Texture.from("assets/bunny.png");

// Create a nxn grid of bunnies
const numBunnies = 8;
for (let i = 0; i < numBunnies ** 2; i++) {
  const bunny = new PIXI.Sprite(texture);
  bunny.anchor.set(0.5);
  bunny.x = (i % numBunnies) * 64;
  bunny.y = Math.floor(i / numBunnies) * 64;
  container.addChild(bunny);
}

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

// Listen for animate update
app.ticker.add((delta) => {
  // rotate the container!
  // use delta to create frame-independent transform
  container.rotation += 0.01 * delta;
});

const container2 = new PIXI.Container();
app.stage.addChild(container2);

const bun = new PIXI.Sprite(texture);
bun.x = app.screen.width - 64;
bun.y = 0;
bun.interactive = true;
bun.buttonMode = true;
bun
  .on(
    "pointerdown",
    ({
      data: {
        button,
        global: { x, y },
      },
    }) => {
      if (button == 0) {
        bun.dragXOffset = bun.x - x;
        bun.dragYOffset = bun.y - y;
        bun.dragEnabled = true; 
      }
    }
  )
  .on("pointermove", ({
    data: {
      global: { x, y }
    },
  }) => {
    if (bun.dragEnabled) {
      bun.x = x + bun.dragXOffset;
      bun.y = y + bun.dragYOffset;
    }
  })
  .on("pointerup", () => bun.dragEnabled = false)
  .on("pointerupoutside", () => bun.dragEnabled = false);
container2.addChild(bun);

bun.dragEnabled = false;
bun.dragXOffset = 0;
bun.dragYOffset = 0;

