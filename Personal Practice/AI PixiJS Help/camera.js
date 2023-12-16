// // Create a new application
// let app = new PIXI.Application({width: 800, height: 600});
// document.body.appendChild(app.view);

// // Create a container for the scene
// let sceneContainer = new PIXI.Container();
// app.stage.addChild(sceneContainer);

// // Create a container for the camera
// let cameraContainer = new PIXI.Container();
// app.stage.addChild(cameraContainer);

// // Create a graphics object for the camera view
// let cameraView = new PIXI.Graphics();
// cameraView.beginFill(0x000000, 0.5);
// cameraView.drawRect(0, 0, app.screen.width, app.screen.height);
// cameraView.endFill();
// cameraContainer.addChild(cameraView);

// // Set the camera container as the mask for the scene container
// sceneContainer.mask = cameraContainer;

// // Create a matrix to represent the camera position and scale
// let cameraMatrix = new PIXI.Matrix();
// cameraMatrix.translate(app.screen.width / 2, app.screen.height / 2);
// cameraMatrix.scale(2, 2);

// // Update the camera matrix every frame
// app.ticker.add(() => {
//     cameraMatrix.tx += 1;
//     cameraMatrix.ty += 1;
//     cameraContainer.transform.setFromMatrix(cameraMatrix);
// });

// // Create some objects to add to the scene
// let object1 = new PIXI.Graphics();
// object1.beginFill(0xFF0000);
// object1.drawRect(-50, -50, 100, 100);
// object1.endFill();
// object1.x = 100;
// object1.y = 100;
// sceneContainer.addChild(object1);

// let object2 = new PIXI.Graphics();
// object2.beginFill(0x00FF00);
// object2.drawRect(-50, -50, 100, 100);
// object2.endFill();
// object2.x = 200;
// object2.y = 200;
// sceneContainer.addChild(object2);



const app = new PIXI.Application();
document.body.appendChild(app.view);

const camera = new PIXI.Matrix();
camera.translate(-100, -100); // move the camera to (-100, -100)

const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
sprite.tint = 0xff0000;
sprite.width = sprite.height = 100;
sprite.position.set(100, 100);

app.stage.addChild(sprite);

// apply the camera transformation to the scene
app.stage.transform.setFromMatrix(camera);

// move the camera to (0, 0)
camera.translate(100, 100);

// update the scene with the new camera position
app.stage.transform.setFromMatrix(camera);
