//These are used for the intellisense and then commented out to run
// import * as PIXI from './lib/pixi.js';
// import * as Victor from './lib/victor.js';

"use strict";

//#region Classes (these are here, rather than another file, for intellisense)

//#region Debug

/**
 * Whether or not debug mode is enabled
 * @type {boolean}
 */
let debugEnabled = true;

/**
 * An object that holds all the debug elements
 * Cleared each frame for frame based debug elements
 */
class Debug extends PIXI.Container
{
    /**
     * Creates a new Debug object and adds it to the scene
     */
    constructor()
    {
        super();

        //Add listener for toggling debug when '/' is pressed
        document.onkeydown = e =>
        {
            e.preventDefault();
            if(e.key === "/") debugEnabled = !debugEnabled;
        };
    }

    /**
     * Updates the debug elements and clears previous frame
     */
    update()
    {
        //Clear the debug elements for this frame
        this.removeChildren();

        //Stop debugging if not enabled
        if(!debugEnabled) return;

        //Collider
        this.drawColliders();
    }

    /**
     * Draws the colliders for all objects
     */
    drawColliders()
    {
        for(const physObj of OBJECTS)
        {
            //Draw circle outline
            const colliderGraphic = new PIXI.Graphics();
            colliderGraphic.beginFill(0x00000, 0);
            colliderGraphic.lineStyle(2, 0xff0000,0.5);
            colliderGraphic.drawCircle(physObj.x, physObj.y, physObj.colliderRadius);
            colliderGraphic.endFill();

            //Add drawing to the containter
            this.addChild(colliderGraphic);
        }
    }
}

/**
 * The debug object for the game
 */
const DEBUG = new Debug();

//#endregion

/**
 * An object with basic physics and is a graphics object
 */
class PhysicsObject extends PIXI.Graphics
{
    /**
     * Creates a new PhysicsObject
     * @param {Function} setupVisual A function of what to draw, requires 1 arg of PhysicsObject
     * @param {Victor} vectorPosition The initial position (not for the visual, for the entire object)
     */
    constructor(setupVisual, vectorPosition = Victor(0, 0), tint = 0xffffff)
    {
        super();

        // --Properties
        
        //-Collider
        /**
         * The collider radius of the base visual
         * @type {number}
         */
        this.baseColliderRadius = 1;

        /**
         * The collider radius of the complete physics object
         * aka the base collider * scale
         * @type {number}
         */
        this.colliderRadius = 1;

        //-Physics
        /**@type {Victor}*/this.vectorPosition = vectorPosition;
        /**@type {Victor}*/this.velocity = Victor(0, 0);
        /**@type {Victor}*/this.momentOfAcceleration = Victor(0, 0);

        //Set the color
        super.tint = tint;

        //Setup visual
        setupVisual(this);

        //Add to the list of objects
        OBJECTS.push(this);
    }

    /**
     * Preforms anything that needs to be run every frame
     */
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
    isColliding(physObj)
    {
        return this.vectorPosition.distance(physObj.vectorPosition) <
            this.colliderRadius + physObj.colliderRadius;
    }

    /**
     * Sets the scale of the object and computes the collider radius
     * @param {number} scale The scale amount to set the object to
     */
    setScale(scale)
    {
        super.scale.x = scale;
        super.scale.y = scale;
        this.colliderRadius = this.baseColliderRadius * scale;
    }

    /**
     * Returns the scale of the object as a number (x component)
     * @returns {number} The scale of the object as a number
     */
    getScale()
    {
        return super.scale.x;
    }
}

/**
 * A friendly object that adds flings and gives a boost
 */
class Orb extends PhysicsObject
{
    /**
     * Creates a new Orb
     * @param {Victor} vectorPosition The initial position (not for the visual, for the entire object)
     * @param {number} visualRadius The radius of the circle being drawn
     * @param {number} colliderRadius The radius of the circle collider
     * @param {number} tint The color of the circle
     */
    constructor(vectorPosition = Victor(0, 0), visualRadius = 20, colliderRadius = visualRadius*2, tint = 0x00ff00)
    {
        //Call the base constructor where it draws a circle
        super(phys =>
        {
            phys.beginFill(0xffffff);
            phys.drawCircle(0, 0, visualRadius);
            phys.endFill();
        }, vectorPosition, tint);

        //Set the collider radius
        super.baseColliderRadius = colliderRadius;
        //Comput the collider radius
        this.setScale(1);

        //Add to the list of orbs
        ORBS.push(this);
    }

    /**
     * Updates this orb with any frame based tasks
     */
    update()
    {
        super.update();
    }

    /**
     * Respawns this orb at a random location within the specified bounds with a random scale
     * @param {PIXI.Rectangle} bounds The bounds to position this orb in
     */
    respawn(bounds)
    {
        //Set a random position within the bounds
        this.vectorPosition = randomRange2D(bounds);

        //Set a random scale
        this.setScale(randomRange(0.75, 1.5));
    }
}

/**
 * The player of the game
 */
class Player extends PhysicsObject
{
    /**
     * Creates a new Player with the specified values
     * @param {Victor} vectorPosition The initial position (not for the visual, for the entire object)
     * @param {number} scaleAmount Amount to scale the initial visual by
     * @param {number} colliderRadius The radius for the collider
     * @param {number} tint The color of the initial visual
     */
    constructor(vectorPosition = Victor(0, 0), scaleAmount = 20, colliderRadius = scaleAmount*0.5, tint = 0x0000ff)
    {
        super(phys =>
        {
            //Create square centered around 0,0
            phys.beginFill(0xffffff);
            const negativeHalfScale = scaleAmount*-0.5;
            //Kind of weird how this uses x2 and y2 for the position (starts from the bottom right)
            phys.drawRect(negativeHalfScale, negativeHalfScale, scaleAmount, scaleAmount);
            phys.endFill();
        }, vectorPosition, tint);

        //Properties
        /**@type {boolean}*/this.isAlive = false;
        /**@type {number}*/this.flings = 0;
        /**The direction to fling @type {number}*/
        this.direction = 0;


        //Set position
        super.vectorPosition = vectorPosition;

        //Set the collider radius
        super.baseColliderRadius = colliderRadius;
        //Comput the collider radius
        this.setScale(1);
    }

    reset()
    {
        this.vectorPosition = Victor(0, 0);
        this.velocity = Victor(0, 0);
        this.isAlive = true;
        this.flings = 5;
        this.direction = Math.PI * 0.5;//Up
    }
}

/**
 * A spike that subtracts flings and bounces the player back
 */
class Spike extends PhysicsObject
{
    /**
     * Creates a new Spike with the specified values
     * @param {Victor} vectorPosition The initial position (not for the visual, for the entire object)
     * @param {number} scaleAmount The amount to scale the initial visual by
     * @param {number} colliderRadius The radius for the collider
     * @param {number} tint The color of the initial visual
     */
    constructor(vectorPosition = Victor(0, 0), scaleAmount = 75, colliderRadius = scaleAmount*0.2, tint = 0xff4500)
    {
        super(phys =>
        {
            //Create a triangle centered around 0,0
            const halfScale = scaleAmount * 0.5;
            phys.beginFill(0xffffff);
            phys.drawPolygon([0, -halfScale, -halfScale, scaleAmount*0.333, halfScale, scaleAmount*0.333]);
            phys.endFill();
        }, vectorPosition, tint);

        //Set position
        super.vectorPosition = vectorPosition;

        //Set the collider radius
        super.baseColliderRadius = colliderRadius;
        //Comput the collider radius
        this.setScale(1);

        //Add to the list of spikes
        SPIKES.push(this);
    }

    /**
     * Respawns the spike at a random location within the specified bounds with a random scale
     * @param {PIXI.Rectangle} bounds The bounds to position the spike in
     */
    respawn(bounds)
    {
        //Set a random position within the bounds
        this.vectorPosition = randomRange2D(bounds);

        //Set a random scale
        this.setScale(randomRange(2, 4));
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
    constructor(xBounds)
    {
        /**@type {Victor}*/this.position = Victor(0, 0);
        /**@type {number}*/this.zoom = 1;
        
        /**
         * The transformation matrix used to apply the camera to the stage
         * @type {PIXI.Matrix}
         */this.matrix = new PIXI.Matrix();

        /**
         * The rectangle that bounds the camera in world space. Computed every update cycle
         * @type {PIXI.Rectangle}
         */
        this.boundingRectangle = new PIXI.Rectangle(0, 0, 0, 0);

        /**
         * The bounds for the camera to stay within
         * @type {Victor}
         */
        this.xBounds = xBounds;
    }

    /**
     * Changes the position of the camera
     * @param {Victor} amount the amount to pan by
     */
    panBy = amount => this.position.add(amount);

    /**
     * Changes the scale of the camera
     * @param {number} amount The amount to zoom by
     */
    zoomBy = amount => this.zoom += amount;

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
        //Compute the matrix and bounding rectangle
        this.computeMatrix();

        //Clamp camera within bounds. If clamped, recompute the matrix bounding rectangle
        const overlapLeft = this.boundingRectangle.left - this.xBounds.x;
        const overlapRight = this.boundingRectangle.right - this.xBounds.y;
        //Prefers left, but if both are overlapping, each frame it will basically oscialte between the two
        //since it will be pushed out of the one which means it won't trigger that one but will the other
        //I am not handling this since it should never actually occur in the game
        if(overlapLeft < 0)
        {
            this.position.x -= overlapLeft;
            this.computeMatrix();
        }
        else if(overlapRight > 0)
        {
            this.position.x -= overlapRight;
            this.computeMatrix();
        }

        //Apply the matrix
        STAGE.transform.setFromMatrix(this.matrix);
    }

    /**
     * Returns the specified position in world space (relative to this camera)
     * @param {Victor} canvasPosition The position relative to the canvas
     * @returns {Victor} The position relative to the world
     */
    canvasToWorld = canvasPosition => toVector(this.matrix.applyInverse(canvasPosition.clone()));

    /**
     * Computes the camera's view bounds in world space and updates the property
     */
    computeBoundingRectangle()
    {
        const topLeft = this.canvasToWorld(Victor(0, 0));
        const bottomRight = this.canvasToWorld(Victor(APP_SIZE.x, APP_SIZE.y));
        this.boundingRectangle = new PIXI.Rectangle(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    }

    /**
     * Computes the matrix to be applied to the stage setting the matrix
     * and bounding rectangle properties (it computes the bounding rectangle)
     */
    computeMatrix()
    {
        //Create the matrix
        this.matrix.identity()
            .translate(-this.position.x, -this.position.y)
            .scale(this.zoom, this.zoom)
            .translate(APP_SIZE.x*0.5, APP_SIZE.y*0.5);

        //Update the bounding rectangle
        this.computeBoundingRectangle();
    }
}

//#endregion

//#region Global Variables (not actually global scope, but like, global for all intents and purposes)

//DOM

/**
 * The container element for the game
 * @type {HTMLElement}
 */
let GAME_CONTAINER_ELEMENT;

//PIXI

/**
 * A vector containing the width and height of the app (canvas element)
 * @type {Victor}
 */
const APP_SIZE = Victor(500, 750);

/**
 * The pixi application
 * @type {PIXI.Application}
 */
const APP = new PIXI.Application({width: APP_SIZE.x, height: APP_SIZE.y});

/**
 * The position of the app on the page (client)
 * @type {Victor}
 */
let APP_CLIENT_POSITION;

/**
 * The center of the app on the page (client)
 * You know, maybe I don't actually need this lol
 * @type {Victor}
 */
let APP_CLIENT_CENTER;

/**
 * The stage for the game (outer most container)
 * @type {PIXI.Container}
 */
const STAGE = APP.stage;

//Camera

/**
 * The main camera for the game
 * @type {Camera}
 */
const CAMERA = new Camera(Victor(-200, 300));

/**
 * The default zoom for the camera
 * @type {number}
 */
const DEFAULT_ZOOM = 0.1;

//#endregion

//#region Managers

//#region Physics Manager

/**@type {number} The amount time should be progressing */
let timeSpeed = 1;

/**@type {number} The amount of friction to be applied to physics objects */
const friction = 1;

//#endregion

//#region Object Manager

/**@type {PhysicsObject[]} The list of all objects in the game */
const OBJECTS = [];

/**@type {Orb[]} The list of all objects in the game */
const ORBS = [];

/**@type {Spike[]} The list of all objects in the game */
const SPIKES = [];

/**@type {Player} The player object. Yes I know, its not const but it should be treated like one*/
let PLAYER;

/**
 * Generates the specified amount of objects, should only be called once
 * @param {number} orbAmount Amount of orbs to generate
 * @param {number} spikeAmount Amount of spikes to generate
 */
const initializeOjects = (orbAmount, spikeAmount) =>
{
    //Generate orbs
    for(let i = 0; i < orbAmount; i++) new Orb();

    //Generate spikes
    for(let i = 0; i < spikeAmount; i++) new Spike();
}

/**
 * Resets physics objects in the game excluding the player
 * @param {PIXI.Rectangle} bounds The bounds to respawn the objects in
 */
const resetObjects = bounds =>
{
    for(const orb of ORBS)
    {
        orb.respawn(bounds);
    }
}

/**
 * Updates all physics objects
 */
const updatePhysicsObjects = () =>
{
    for(const object of OBJECTS)
    {
        object.update();
    }
}

//#endregion

//#region Input Manager

/**
 * The position of the mouse in client space (the entire website)
 * @type {Victor}
 */
let mouseClientPosition = Victor(0, 0);

/**
 * The position of the mouse in canvas space (the canvas object)
 * @type {Victor}
 */
let mouseCanvasPosition = Victor(0, 0);

/**
 * The position of the mouse in world space (takes into account the camera)
 * @type {Victor}
 */
let mouseWorldPosition = Victor(0, 0);

/**@type {boolean}*/
let mouseDown = false;

/**
 * Initializes input related tasks 
 */
const initializeInputManager = () =>
{
    //Update the mouse position on move
    document.onpointermove = e =>
    {
        mouseClientPosition = Victor(e.clientX, e.clientY);
        mouseCanvasPosition = mouseClientPosition.clone().subtract(APP_CLIENT_POSITION);
    };

    //When mouse down
    GAME_CONTAINER_ELEMENT.onpointerdown = e =>
    {
        e.preventDefault();
        mouseDown = true;
    };

    //When mouse up
    GAME_CONTAINER_ELEMENT.onpointerup = e =>
    {
        e.preventDefault();
        mouseDown = false;
    };
}

/**
 * Updates input related tasks
 */
const updateInputManager = () =>
{
    //This needs to be updated every frame since the camera can move even when the mouse isn't
    mouseWorldPosition = CAMERA.canvasToWorld(mouseCanvasPosition);
}

//#endregion

//#region Scene Manager

/**
 * The scenes in the game
 * @type {PIXI.Container[]}
 */
const SCENES = [];

/**
 * An "enum" for the scene names
 */
const SCENE_ID = { Menu: 0, Game: 1 };

/**
 * Initializes all scenes and adds them to the stage
 */
const initializeScenes = () =>
{
    //Create the scenes and set them invisible
    for(const sceneID in SCENE_ID)
    {
        const scene = new PIXI.Container();
        scene.visible = false;
        SCENES.push(scene);
        STAGE.addChild(scene);
    }
}

/**
 * Returns the scene from the specified scene id
 * @param {number} sceneID The scene number, integer, which should be
 * passed in from the SCENE_ID enum
 * @returns {PIXI.Container}
 */
const getScene = (sceneID) => SCENES[sceneID];

/**
 * Sets the specified scene visible and all others invisible
 * @param {number} sceneID The scene number, integer, which should be
 * passed in from the SCENE_ID enum
 */
const switchToScene = (sceneID) =>
{
    for(const scene of SCENES) scene.visible = false;
    SCENES[sceneID].visible = true;
}

//#endregion

//#endregion

//#region Initialization and Mono Behaviors

/**
 * Initial method for loading into the DOM
 */
const init = () =>
{
    //The game container
    GAME_CONTAINER_ELEMENT = document.querySelector("#gameContainer");

    //Add the game panel to the dom
    GAME_CONTAINER_ELEMENT.appendChild(APP.view);

    //Set the position relative to the page
    const bounds = APP.view.getBoundingClientRect();
    APP_CLIENT_POSITION = Victor(bounds.x, bounds.y);

    //Set the client center
    APP_CLIENT_CENTER = APP_CLIENT_POSITION.clone().add(APP_SIZE.clone().multiplyScalar(0.5));

    //Load any assets
    loadAssets();
}
window.onload = init;

/**
 * Loads all the assets for the game. Called after the DOM is loaded
 */
const loadAssets = async() =>
{
    //DEBUG
    // PIXI.Assets.addBundle('sprites', {
    //     spaceship: 'images/spaceship.png',
    //     explosions: 'images/explosions.png',
    //     move: 'images/move.png'
    //   });
    // ASSETS = await PIXI.Assets.loadBundle('sprites');
    start();
}

/**
 * Called when all assets are loaded
 */
const start = () =>
{
    //Initialize the input manager
    initializeInputManager();

    //Initialize the scenes
    initializeScenes();
    switchToScene(SCENE_ID.Game);
    initializeGameScene(getScene(SCENE_ID.Game));

    //Add debug to the stage to be visible over everything
    STAGE.addChild(DEBUG);

    //Begin the game loop
    APP.ticker.add(update);
}

/**
 * The game loop
 */
const update = () =>
{
    //TODO FSM
    updateGame();


    /*-----Ending tasks of update, nothing past here-----*/
    
    //Update the debugger AFTER objects are updated so there is no lag in positioning
    DEBUG.update();
}

//#endregion

//#region Menu Scene



//#endregion

//#region Game Scene

/**
 * Initializes the game into the specified scene
 * @param {PIXI.Container} gameScene The scene to initialize the game into
 */
const initializeGameScene = gameScene =>
{
    //DEBUG
    // const orb = new Orb(Victor(APP_SIZE.x*0.5, APP_SIZE.y*0.5), 50);
    const orb = new Orb(Victor(APP_SIZE.x*0.5, APP_SIZE.y*0.5));
    // const orb = new Orb(Victor(APP_SIZE.x*0.5, APP_SIZE.y*0.5), 100);
    // orb.setScale(7);
    // const orb2 = new Orb(Victor(APP_SIZE.x*0.5 + 500, APP_SIZE.y*0.5), 700, 1400, 0xffff00);
    // PLAYER = new Player(Victor(0, 0), 20);
    PLAYER = new Player(Victor(100, 200));
    // spike = new Spike(Victor(APP_SIZE.x*0.5 + 100, APP_SIZE.y*0.5 + 100), 50);
    spike = new Spike(Victor(APP_SIZE.x*0.5 + 100, APP_SIZE.y*0.5 + 100));

    //Initialize the objects
    initializeOjects(10, 7);

    //Add all the objects to the scene
    for(const object of OBJECTS)
    {
        gameScene.addChild(object);
    }
}
let spike;//DEBUG
/**
 * Updates the game scene
 */
const updateGame = () =>
{
    //DEBUG
    // PLAYER.rotation += 0.01;
    // console.log(mouseClientPosition);
    if(mouseDown)
    {
        // CAMERA.easeTo(mouseCanvasPosition.clone().add(Victor(-APP_SIZE.x*.5, -APP_SIZE.y*.5)), 2, 0.1);
        // CAMERA.easeTo(Victor(0, 0), 50, 0.01);
        // CAMERA.easeTo(SPIKES[0].vectorPosition.clone(), 2, 0.1);
        // spike.vectorPosition = mousePosition.clone();
        // CAMERA.easeTo(mouseCanvasPosition, 0.1, 0.1);
        CAMERA.easeTo(mouseCanvasPosition, 5, 0.1);
        // ORBS[0].setScale(ORBS[0].getScale() + 0.001);
        // ORBS[1].setScale(ORBS[1].getScale() + 0.001);
    }
    else
    {
        // CAMERA.easeTo(Victor(0, 0), 1, 0.1);
        // CAMERA.easeTo(mouseCanvasPosition, 1, 0.1);
        CAMERA.easeTo(APP_SIZE.clone().multiplyScalar(0.5), 1, 0.1);
    }
    CAMERA.update();
    updateInputManager();

    //DEBUG test collisions
    // PLAYER.vectorPosition = mouseWorldPosition.clone();
    // for(const orb of ORBS)
    // {
    //     orb.tint = 0xffffff;
    // }

    // if(PLAYER.isColliding(ORBS[0])) ORBS[0].tint = 0xff0000;
    // if(PLAYER.isColliding(ORBS[1])) ORBS[1].tint = 0x00ff00;

    // spike.vectorPosition = CAMERA.canvasToWorld(Victor(300, 200));


    /*-----Ending tasks of update, nothing past here-----*/

    //Update all physics objects
    updatePhysicsObjects();
}

/**
 * Resets everything in the game to starting values
 */
const resetGame = () =>
{
    //Reset player
    PLAYER.reset();

    //Reset camera
    CAMERA.zoom = DEFAULT_ZOOM;
    CAMERA.position = Victor(0, 0);

    //Reset other physics objects
    resetObjects();
}

//#endregion

//#region Utility

/**
 * Returns a Victor of the specified point or object with x and y properties
 * @param {any} point Any object that holds x and y properties
 * @returns {Victor} A vector with the same x and y values as the point
 */
const toVector = (point) => Victor(point.x, point.y);

/**
 * Generates a random number within the specified range
 * @param {number} min Min inclusive
 * @param {number} max Max inclusive
 * @returns {number} A random number within the specified range
 */
const randomRange = (min, max) => Math.random() * (max - min) + min;


/**
 * Generates a random vector within the specified bounds
 * @param {PIXI.Rectangle} bounds The bounds within which the vector should be generated
 * @returns {Victor} The randomly generated vector
 */
const randomRange2D = bounds =>
    Victor(randomRange(bounds.x, bounds.right), randomRange(bounds.y, bounds.bottom));

//#endregion
