//These are used for the intellisense and then commented out to run
// import * as PIXI from './lib/pixi.js';
// import * as Victor from './lib/victor.js';

"use strict";

//#region Classes (these are here for intellisense)

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
        this.velocity.add(this.momentOfAcceleration.clone().multiplyScalar(timeSpeed));
        this.vectorPosition.add(this.velocity.clone().multiplyScalar(timeSpeed));

        //Apply "friction"
        this.velocity.subtract(this.velocity.clone().multiplyScalar(friction * timeSpeed));

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

/**
 * The player of the game
 */
class Player extends PhysicsObject
{
    /**
     * Creates a new Player with the specified values
     * @param {number} scaleAmount Amount to scale the initial visual by
     * @param {number} colliderRadius The radius for the collider
     * @param {number} color The color of the initial visual
     */
    constructor(scaleAmount = 100, colliderRadius = scaleAmount*0.5, color = 0x0000ff)
    {
        super(phys =>
        {
            //Create square centered around 0,0
            phys.beginFill(color);
            const negativeHalfScale = scaleAmount*-0.5;
            phys.drawRect(-negativeHalfScale, -negativeHalfScale, scaleAmount, scaleAmount);
            phys.endFill();
        });

        //Set the collider radius
        super.colliderRadius = colliderRadius;
    }
}

/**
 * A spike that subtracts flings and bounces the player back
 */
class Spike extends PhysicsObject
{
    /**
     * Creates a new Spike with the specified values
     * @param {number} scaleAmount The amount to scale the initial visual by
     * @param {number} colliderRadius The radius for the collider
     * @param {number} color The color of the initial visual
     */
    constructor(scaleAmount, colliderRadius = scaleAmount*0.2, color = 0x0000ff)
    {
        super(phys =>
        {
            //Create a triangle centered around 0,0
            const halfScale = scaleAmount*0.5;
            phys.beginFill(color);
            phys.drawPolygon([0, -halfScale, -halfScale, halfScale, halfScale, halfScale]);
            phys.endFill();
        });

        //Set the collider radius
        super.colliderRadius = colliderRadius;
    }
}

/**
 * A camera which can do basic panning and zooming
 */
class Camera
{
    /**
     * Creates a new Camera
     */
    constructor()
    {
        /**@type {Victor}*/this.position = Victor(0, 0);
        /**@type {number}*/this.zoom = 1;
        /**@type {PIXI.Matrix}*/this.matrix = new PIXI.Matrix();
    }

    /**
     * Changes the position of the camera
     * @param {Victor} amount the amount to pan by
     */
    panBy(amount)
    {
        this.position.add(amount);
    }

    /**
     * Changes the scale of the camera
     * @param {number} amount The amount to zoom by
     */
    zoomBy(amount)
    {
        this.zoom += amount;
    }

    /**
     * Zooms to the specified point using the specified easing factor
     * (it will ease out exponentially). Easing factor should usually be between
     * 0 and 1 unless you want weird movement
     * @param {Victor} targetPosition Position to try to ease to
     * @param {number} targetZoom The zoom to try to ease to
     * @param {number} easingFactor The factor to ease by (for example 0.1 would
     * move and zoom by 1 tenth of the distance each time it is called)
     */
    easeTo(targetPosition, targetZoom, easingFactor)
    {
        this.panBy(targetPosition.clone().subtract(this.position).multiplyScalar(easingFactor));
        this.zoomBy((targetZoom - this.zoom) * easingFactor);
    }

    /**
     * Updates the camera matrix and applies it to the scene
     */
    update()
    {
        //Create the matrix
        this.matrix.identity()
            .translate(-this.position.x, -this.position.y)
            .scale(this.zoom, this.zoom)
            .translate(APP_WIDTH*0.5, APP_HEIGHT*0.5);

        //Apply the matrix
        STAGE.transform.setFromMatrix(this.matrix);
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


const CAMERA = new Camera();

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

//#region Input Manager

/**
 * The position of the mouse
 * @type {Victor}
 */
let mousePos = Victor(0, 0);

/**@type {boolean}*/
let mouseDown = false;

const initializeInputManager = () =>
{
    //Update the mouse position on move
    APP.view.onpointermove = e =>
    {
        mousePos = Victor(e.clientX, e.clientY);
    };

    //When mouse down
    APP.view.onpointerdown = e =>
    {
        mouseDown = true;
    };

    //When mouse up
    APP.view.onpointerup = e =>
    {
        mouseDown = false;
    };
}

//#endregion

//#endregion

//#region Initialization and Mono Behaviors

/**
 * Initial method for loading into the DOM
 */
const init = () =>
{
    //Initialize the input manager
    initializeInputManager();

    //Add the game panel to the dom
    document.body.appendChild(APP.view);
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

    // console.log(mousePos);
    if(mouseDown) CAMERA.easeTo(mousePos, 2, 0.1);
    else CAMERA.easeTo(mousePos, 1, 0.1);
    CAMERA.update();
}

//#endregion

