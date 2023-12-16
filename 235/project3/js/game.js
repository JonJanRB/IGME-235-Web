//These are used for the intellisense and then commented out to run
// import * as PIXI from './lib/pixi.js';
// import * as Victor from './lib/victor.js';
// import * as viewport from './lib/pixi_viewport.js';

"use strict";

//#region Classes

class PhysicsObject extends PIXI.Graphics
{
    /**
     * Creates a new PhysicsObject
     * @param {Function} drawCall
     * A function of what to draw, requires 1 arg of PhysicsObject
     */
    constructor(drawCall)
    {
        super();

        // --Properties

        /**@type {Victor} width and height*/
        this.vectorScale = Victor(0, 0);
        
        //Maybe just use destroy instead of enabling and pooling
        // /**@type {boolean}*/this.enabled = true;
        
        //-Collider
        /**@type {number}*/this.colliderRadius = 1;
        // /**@type {number}*/this.rotation = 0;

        //-Physics
        /**@type {Victor}*/this.vectorPosition = Victor(0, 0);
        /**@type {Victor}*/this.velocity = Victor(0, 0);
        /**@type {Victor}*/this.momentOfAcceleration = Victor(0, 0);

        //Setup visual
        drawCall(this);
    }

    //"Properties"

    //Methods
    update()
    {
        //Basic physics
        this.velocity.add(this.momentOfAcceleration.multiplyScalar(timeSpeed));
        this.vectorPosition.add(this.velocity.multiplyScalar(timeSpeed));

        //Apply "friction"
        this.velocity.subtract(this.velocity.multiplyScalar(friction * timeSpeed));

        //Reset acceleration
        this.momentOfAcceleration = Victor(0, 0);

        //Update the base pixi properties
        this.x = this.vectorPosition.x;
        this.y = this.vectorPosition.y;
    }

    /**
     * Checks if this object collides with another
     * @param {PhysicsObject} physObj other physics object to check collision with 
     * @returns {boolean} TRUE if the objects are colliding
     */
    colliding(physObj)
    {
        return this.vectorPosition.distance(physObj.vectorPosition) <
            this.colliderRadius + physObj.colliderRadius;
    }
}

/**
 * The friendly object that adds flings and gives a boost
 */
class Orb extends PhysicsObject
{
    /**
     * Creates a new Orb
     * @param {number} visualRadius The radius of the circle being drawn
     * @param {number} colliderRadius The radius of the circle collider
     * @param {number} color The color of the circle
     */
    constructor(visualRadius, colliderRadius = visualRadius*2, color = 0x00ff00)
    {
        //Call the base constructor where it draws a circle
        super(phys =>
        {
            phys.beginFill(color);
            phys.drawCircle(0, 0, visualRadius);
            phys.endFill();
        });

        //Set the collider radius
        super.colliderRadius = colliderRadius;

        //Add to the list of orbs
        ORBS.push(this);
    }
}

class Player extends PhysicsObject
{
    constructor(scaleAmount = 100, colliderRadius = scaleAmount*0.5, color = 0x0000ff)
    {
        super(phys =>
        {
            phys.beginFill(color);
            const negativeHalfScale = scaleAmount*-0.5;
            phys.drawRect(-negativeHalfScale, -negativeHalfScale, scaleAmount, scaleAmount);
            phys.endFill();
        });

        super.colliderRadius = colliderRadius;
    }
}

class Spike extends PhysicsObject
{
    constructor(scaleAmount, colliderRadius = scaleAmount*0.2, color = 0x0000ff)
    {
        super(phys =>
        {
            const halfScale = scaleAmount*0.5;
            phys.beginFill(color);
            phys.lineTo(-halfScale, halfScale);
            phys.lineTo(halfScale, halfScale);
            phys.lineTo(0, -halfScale);
            phys.endFill();
        });

        super.colliderRadius = colliderRadius;
    }
}

//#endregion

//#region Global Variables

//Pixi stuff
const APP_WIDTH = 500;
const APP_HEIGHT = 750;
const APP = new PIXI.Application({width: APP_WIDTH, height: APP_HEIGHT});
const STAGE = APP.stage;
// let ASSETS;

//#endregion

//#region Managers

//#region Physics Manager

/**@type {number} The amount time should be progressing */
let timeSpeed = 1;

/**@type {number} The amount of friction to be applied to physics objects */
const friction = 1;

//#endregion

//#region Object Manager

/**@type {Orb[]} The list of all objects in the game */
const ORBS = [];

//#endregion

//#endregion

//#region Initialization and Mono Behaviors

/**
 * Initial method for loading into the DOM
 */
const init = () =>
{
    //Add the game panel to the dom
    document.body.appendChild(APP.view);
    // viewport.create(createRenderer());
    loadAssets();
}
window.onload = init;

/**
 * Loads all the assets for the game
 */
const loadAssets = async() =>
{
    // PIXI.Assets.addBundle('sprites', {
    //     spaceship: 'images/spaceship.png',
    //     explosions: 'images/explosions.png',
    //     move: 'images/move.png'
    //   });
    // ASSETS = await PIXI.Assets.loadBundle('sprites');
    start();
}

//https://davidfig.github.io/pixi-viewport/ These helped for camera
//https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html
// const createRenderer = () => 
// {
//     const renderer = new PIXI.Renderer(
//     {
//         backgroundAlpha: 0,
//         width: window.innerWidth,
//         height: window.innerHeight,
//         resolution: window.devicePixelRatio,
//         antialias: true,
//     });
//     document.body.appendChild(renderer.view);
//     return renderer;
//     // renderer.view.style.position = 'fixed';
//     // renderer.view.style.width = '100vw';
//     // renderer.view.style.height = '100vh';
//     // renderer.view.style.top = 0;
//     // renderer.view.style.left = 0;
//     // renderer.view.style.background = 'rgba(0,0,0,.1)';
// }

/**
 * Starts the game 
 */
const start = () =>
{
    const orb = new Orb(50);
    orb.vectorPosition = Victor(APP_WIDTH*0.5, APP_HEIGHT*0.5);
    STAGE.addChild(orb);

    const player = new Player(20);
    player.vectorPosition = Victor(30, 50);
    STAGE.addChild(player);

    const spike = new Spike(50);
    spike.vectorPosition = Victor(APP_WIDTH*0.5 + 100, APP_HEIGHT*0.5 + 100);
    STAGE.addChild(spike);

    //Begin the game loop
    APP.ticker.add(update);
}

/**
 * The game loop
 */
const update = () =>
{
    for(const orb of ORBS)
    {
        orb.update();
    }
}

//#endregion

