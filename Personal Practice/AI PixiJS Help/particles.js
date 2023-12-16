// // Create a new application
// let app = new PIXI.Application({width: 800, height: 600});
// document.body.appendChild(app.view);

// // Create a container for the particles
// let particleContainer = new PIXI.ParticleContainer();
// app.stage.addChild(particleContainer);

// // Create a graphics object for the particle texture
// let graphics = new PIXI.Graphics();
// graphics.beginFill(0xFF3300);
// graphics.drawCircle(0, 0, 5);
// graphics.endFill();

// // Generate a texture from the graphics object
// let texture = app.renderer.generateTexture(graphics);

// // Function to add a particle
// function addParticle() {
//     let particle = new PIXI.Sprite(texture);
//     particle.anchor.set(0.5);
//     particle.x = app.screen.width / 2;
//     particle.y = app.screen.height / 2;
//     particle.vx = Math.random() * 2 - 1;
//     particle.vy = Math.random() * 2 - 1;
//     particle.alpha = 1;
//     particleContainer.addChild(particle);
//     return particle;
// }

// // Function to update the particles
// function updateParticles() {
//     for (let i = particleContainer.children.length - 1; i >= 0; i--) {
//         let particle = particleContainer.children[i];
//         particle.x += particle.vx;
//         particle.y += particle.vy;
//         particle.alpha *= 0.99; // Fade out over time
//         if (particle.alpha < 0.01) {
//             particle.alpha = 1;
//             particle.x = app.screen.width / 2;
//             particle.y = app.screen.height / 2;
//         }
//     }
// }

// // Add particles every frame
// app.ticker.add(() => {
//     for (let i = 0; i < 10; i++) {
//         addParticle();
//     }
//     updateParticles();
// });


// // Create a new application
// let app = new PIXI.Application({width: 800, height: 600});
// document.body.appendChild(app.view);

// // Create a container for the particles
// let particleContainer = new PIXI.ParticleContainer();
// app.stage.addChild(particleContainer);

// // Create a graphics object for the particle texture
// let graphics = new PIXI.Graphics();
// graphics.beginFill(0xFF3300);
// graphics.drawPolygon([0, 0, 30, 0, 15, 30]);
// graphics.endFill();

// // Generate a texture from the graphics object
// let texture = app.renderer.generateTexture(graphics);

// // Function to add a particle
// function addParticle() {
//     let particle = new PIXI.Sprite(texture);
//     particle.anchor.set(0.5);
//     particle.x = app.screen.width / 2;
//     particle.y = app.screen.height / 2;
//     particle.vx = Math.random() * 2 - 1;
//     particle.vy = Math.random() * 2 - 1;
//     particle.alpha = 1;
//     particle.rotation = Math.random() * Math.PI * 2;
//     particleContainer.addChild(particle);
//     return particle;
// }

// // Function to update the particles
// function updateParticles() {
//     for (let i = particleContainer.children.length - 1; i >= 0; i--) {
//         let particle = particleContainer.children[i];
//         particle.x += particle.vx * 5;
//         particle.y += particle.vy * 5;
//         particle.alpha *= 0.99; // Fade out over time
//         particle.scale.x *= 0.99; // Shrink over time
//         particle.scale.y *= 0.99; // Shrink over time
//         particle.rotation += 0.01; // Rotate over time
//         if (particle.alpha < 0.01) {
//             particle.alpha = 1;
//             particle.x = app.screen.width / 2;
//             particle.y = app.screen.height / 2;
//             particle.scale.x = 1;
//             particle.scale.y = 1;
//         }
//     }
// }

// // Add particles every frame
// app.ticker.add(() => {
//     for (let i = 0; i < 5; i++) {
//         addParticle();
//     }
//     updateParticles();
// });


// // Create a new application
// let app = new PIXI.Application({width: 800, height: 600});
// document.body.appendChild(app.view);

// // Create a container for the particles
// let particleContainer = new PIXI.ParticleContainer();
// app.stage.addChild(particleContainer);

// // Create a graphics object for the particle texture
// let graphics = new PIXI.Graphics();
// graphics.beginFill(0xFF3300);
// graphics.drawPolygon([0, 0, 30, 0, 15, 30]);
// graphics.endFill();

// // Generate a texture from the graphics object
// let texture = app.renderer.generateTexture(graphics);

// // Function to add a particle
// function addParticle(x, y) {
//     let particle = new PIXI.Sprite(texture);
//     particle.anchor.set(0.5);
//     particle.x = x;
//     particle.y = y;
//     particle.vx = Math.random() * 2 - 1;
//     particle.vy = Math.random() * 2 - 1;
//     particle.alpha = 1;
//     particle.rotation = Math.random() * Math.PI * 2;
//     particleContainer.addChild(particle);
//     return particle;
// }

// // Function to update the particles
// function updateParticles() {
//     for (let i = particleContainer.children.length - 1; i >= 0; i--) {
//         let particle = particleContainer.children[i];
//         particle.x += particle.vx * 5;
//         particle.y += particle.vy * 5;
//         particle.alpha *= 0.99; // Fade out over time
//         particle.scale.x *= 0.99; // Shrink over time
//         particle.scale.y *= 0.99; // Shrink over time
//         particle.rotation += 0.01; // Rotate over time
//         if (particle.alpha < 0.01) {
//             particle.alpha = 1;
//             particle.x = app.screen.width / 2;
//             particle.y = app.screen.height / 2;
//             particle.scale.x = 1;
//             particle.scale.y = 1;
//         }
//     }
// }

// // Add particles when the mouse is clicked
// app.view.onclick = (event) => {
//     for (let i = 0; i < 5; i++) {
//         addParticle(event.data.global.x, event.data.global.y);
//     }
// };

// // Update the particles every frame
// app.ticker.add(() => {
//     updateParticles();
// });


// Create a new application
let app = new PIXI.Application({width: 800, height: 600});
document.body.appendChild(app.view);

// Create a container for the particles
let particleContainer = new PIXI.ParticleContainer();
app.stage.addChild(particleContainer);

// Create a graphics object for the particle texture
let graphics = new PIXI.Graphics();
graphics.beginFill(0xFF3300);
graphics.drawPolygon([0, 0, 30, 0, 15, 30]);
graphics.endFill();

// Generate a texture from the graphics object
let texture = app.renderer.generateTexture(graphics);

// Function to add a particle
function addParticle(x, y) {
    let particle = new PIXI.Sprite(texture);
    particle.anchor.set(0.5);
    particle.x = x;
    particle.y = y;
    particle.vx = Math.random() * 2 - 1;
    particle.vy = Math.random() * 2 - 1;
    particle.alpha = 1;
    particle.rotation = Math.random() * Math.PI * 2;
    particleContainer.addChild(particle);
    return particle;
}

// Function to update the particles
function updateParticles() {
    for (let i = particleContainer.children.length - 1; i >= 0; i--) {
        let particle = particleContainer.children[i];
        particle.x += particle.vx * 5;
        particle.y += particle.vy * 5;
        particle.alpha *= 0.99; // Fade out over time
        particle.scale.x *= 0.99; // Shrink over time
        particle.scale.y *= 0.99; // Shrink over time
        particle.rotation += 0.01; // Rotate over time
        if (particle.alpha < 0.01) {
            particle.alpha = 1;
            particle.x = app.screen.width / 2;
            particle.y = app.screen.height / 2;
            particle.scale.x = 1;
            particle.scale.y = 1;
        }
    }
}

// Add particles when the mouse is clicked
document.addEventListener('mousedown', (event) => {
    for (let i = 0; i < 5; i++) {
        addParticle(event.clientX, event.clientY);
    }
});

// Update the particles every frame
app.ticker.add(() => {
    updateParticles();
});
