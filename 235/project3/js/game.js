//These are used for the intellisense and then commented out to run
// import * as PIXI from './lib/pixi.js';
// import * as Victor from './lib/victor.js';
// import {Howl, Howler} from './lib/howler.js';

"use strict";

//#region Classes (these are here, rather than another file, for intellisense)

//#region Debug

/**
 * Whether or not debug mode is enabled
 * @type {boolean}
 */
let debugEnabled = false;

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
 * @abstract
 */
class PhysicsObject extends PIXI.Graphics
{
    /**
     * Creates a new PhysicsObject
     * @param {Function} setupVisual A function of what to draw, requires 1 arg of PhysicsObject
     * @param {Victor} vectorPosition The initial position (not for the visual, for the entire object)
     * @param {number} tint The color of the tint
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
        this.velocity.subtract(this.velocity.clone().multiplyScalar(FRICTION * timeSpeed));

        //Reset acceleration
        this.momentOfAcceleration = Victor(0, 0);

        //Update the base pixi properties
        this.updatePosition();
    }

    /**
     * Updates this object's base pixi position with vector position
     */
    updatePosition()
    {
        this.x = this.vectorPosition.x;
        this.y = this.vectorPosition.y;
    }

    /**
     * Checks if this object collides with another
     * @param {PhysicsObject} other The physics object to check collision with 
     * @returns {boolean} TRUE if the objects are colliding
     */
    isColliding(other)
    {
        return isColliding(this.vectorPosition, this.colliderRadius,
            other.vectorPosition, other.colliderRadius)
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
 * General physics objects that are procedurally placed such as orbs or spikes
 * @abstract
 */
class Obstacle extends PhysicsObject
{
    /**
     * Creates a new Obstacle
     * @param {Function} setupVisual A function of what to draw, requires 1 arg of PhysicsObject
     * @param {Victor} vectorPosition The initial position (not for the visual, for the entire object)
     * @param {number} colliderRadius The radius of the circle collider
     * @param {number} tint The color of the tint
     */
    constructor(setupVisual, vectorPosition = Victor(0, 0), colliderRadius = 1, tint = 0xffffff)
    {
        super(setupVisual, vectorPosition, tint);

        //Set the collider radius
        super.baseColliderRadius = colliderRadius;
        //Comput the collider radius
        super.setScale(1);

        //Add to obstacle list
        OBSTACLES.push(this);
    }

    /**
     * Respawns this obstacle at a random location within the specified bounds with a random scale
     * @param {PIXI.Rectangle} bounds The bounds to position this obstacle
     * @param {number} scaleMin The minimum scale used to generate the random scale
     * @param {number} scaleMax The maximum scale used to generate the random scale
     */
    respawn(bounds, scaleMin, scaleMax)
    {
        //Set a random position within the bounds
        this.vectorPosition = randomRange2D(bounds);

        //Set a random scale
        this.setScale(randomRange(scaleMin, scaleMax));
    }
}

/**
 * A friendly object that adds flings and gives a boost
 */
class Orb extends Obstacle
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
        }, vectorPosition, colliderRadius, tint);

        //Add to the list of orbs
        ORBS.push(this);
    }

    /**
     * Respawns this orb at a random location within the specified bounds with a random scale
     * @param {PIXI.Rectangle} bounds The bounds to position this orb in
     */
    respawn(bounds)
    {
        super.respawn(bounds, 0.5, 1);
    }

    /**
     * Updates this orb
     */
    update()
    {
        this.updatePosition();
    }
}

/**
 * An "enum" for the player states
 */
const PLAYER_STATE = Object.freeze({ Dead: 0, Idle: 1, Aiming: 2 , Tutorial: 3});

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
     * @param {number} tint The color of the player
     */
    constructor(vectorPosition = CAMERA_POSITION_DEFAULT.clone(), scaleAmount = 20, colliderRadius = scaleAmount*0.5, tint = 0x0000ff)
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

        /**
         * The state of the player represented by the PLAYER_STATE enum
         * @type {number}
         */
        this.playerState = PLAYER_STATE.Dead;

        //Set position
        super.vectorPosition = vectorPosition;

        //Set the collider radius
        super.baseColliderRadius = colliderRadius;
        //Comput the collider radius
        this.setScale(1);
    }

    /**
     * Resets the player to the starting values
     */
    reset()
    {
        this.vectorPosition = CAMERA_POSITION_DEFAULT.clone();
        this.velocity = Victor(0, 0);
        this.isAlive = true;
        this.flings = 5;
        this.direction = PI_OVER_2;//Up
    }

    /**
     * Updates this player
     */
    update()
    {
        


        //Apply gravity
        this.momentOfAcceleration.add(GRAVITY.clone().multiplyScalar(timeSpeed));

        //Face where the player is moving
        this.rotation = this.velocity.angle();

        super.update();
    }

    /**
     * Starts aiming the player
     */
    aim()
    {
        this.playerState = PLAYER_STATE.Aiming;
        SFX[SFX_ID.Aim].play();
    }
}

/**
 * A spike that subtracts flings and bounces the player back
 */
class Spike extends Obstacle
{
    /**
     * Creates a new Spike with the specified values
     * @param {Victor} vectorPosition The initial position (not for the visual, for the entire object)
     * @param {number} scaleAmount The amount to scale the initial visual by
     * @param {number} colliderRadius The radius for the collider
     * @param {number} tint The color of the spike
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
        }, vectorPosition, colliderRadius, tint);

        //Add to the list of spikes
        SPIKES.push(this);
    }

    /**
     * Respawns the spike at a random location within the specified bounds with a random scale
     * @param {PIXI.Rectangle} bounds The bounds to position the spike in
     */
    respawn(bounds)
    {
        super.respawn(bounds, 0.5, 1);

        //Set a random rotation
        super.rotation = random(TWO_PI);
    }

    /**
     * Updates this spike
     */
    update()
    {
        this.updatePosition();
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

//#region DOM

/**
 * The container element for the game
 * @type {HTMLElement}
 */
let GAME_CONTAINER_ELEMENT;

//#endregion

//#region PIXI

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

//#endregion

//#region Camera

/**
 * The main camera for the game
 * @type {Camera}
 */
const CAMERA = new Camera(Victor(0, APP_SIZE.x));

/**
 * The default position for the camera
 * @type {Victor}
 */
const CAMERA_POSITION_DEFAULT = Victor(APP_SIZE.x * 0.5, 0);

/**
 * The default zoom for the camera
 * @type {number}
 */
const CAMERA_ZOOM_DEFAULT = 1;

/**
 * The zoom for the camera when aiming
 * @type {number}
 */
const CAMERA_ZOOM_AIMING = CAMERA_ZOOM_DEFAULT * 1.5;

/**
 * The factor to ease the camera by normally
 * @type {number}
 */
const CAMERA_EASING_FACTOR = 0.1;

//#endregion

//#region Math

/**
 * 90 degrees in radians. Straight up
 * @type {number}
 */
const PI_OVER_2 = Math.PI * 0.5;

/**
 * 360 degrees in radians. Full circle
 * @type {number}
 */
const TWO_PI = Math.PI * 2;

//#endregion

//#endregion

//#region Managers

//#region Physics Manager

/**@type {number} The game speed without being proccessed by delta time */
let currentGameSpeed = 1;

/**@type {number} The game speed being targeted (eased to) */
let targetGameSpeed = 1;

/**@type {number} The amount time should be progressing (game speed * delta time)*/
let timeSpeed = 1;

/**@type {number} The amount of friction to be applied to physics objects */
const FRICTION = 0.9;

/**@type {Victor} The gravity to be applied to physics objects */
const GRAVITY = Victor(0, 100000);

/**@type {number} The amount of easing to apply to the time speed */
const TIME_EASING_FACTOR = 0.1;

/**
 * Updates time speed
 */
const updatePhysicsManager = () =>
{
    //Ease to the target game speed
    targetGameSpeed += (targetGameSpeed - currentGameSpeed) * TIME_EASING_FACTOR;
    //Compute the time speed, use elapsed SECONDS so convert from ms
    timeSpeed = targetGameSpeed * APP.ticker.elapsedMS * 0.001;
}

//#endregion

//#region Object Manager

/**@type {PhysicsObject[]} The list of all objects in the game */
const OBJECTS = [];

/**@type {Obstacle[]} The list of all obstacles in the game */
const OBSTACLES = [];

/**@type {Orb[]} The list of all orbs in the game */
const ORBS = [];

/**@type {Spike[]} The list of all spikes in the game */
const SPIKES = [];

/**@type {Player} The player object */
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
    //How much space the obstacles need to give the player initially
    const personalSpace = PLAYER.colliderRadius * 10;

    //Spawn all the orbs
    for(const obstacle of OBSTACLES)
    {
        //Make sure the obstacle isn't colliding with the player within a reasonable distance
        do
        {
            obstacle.respawn(bounds);
        }
        while(isColliding(obstacle.vectorPosition, obstacle.colliderRadius, PLAYER.vectorPosition, personalSpace))
    }
}

/**
 * Updates all physics objects
 */
const updateObjects = () =>
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
 * The position of the mouse when it was last pressed in canvas space
 * @type {Victor}
 */
let mouseDownCanvasPosition = Victor(0, 0);

/**
 * The position of the mouse when it was last released in canvas space
 * @type {Victor}
 */
let mouseUpCanvasPosition = Victor(0, 0);

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
        //Stop from dragging on text
        e.preventDefault();
        mouseDown = true;

        //Position when pressed
        mouseDownCanvasPosition = Victor(e.clientX, e.clientY).subtract(APP_CLIENT_POSITION);

        //Begin aiming
        PLAYER.aim();
    };

    //When mouse up
    GAME_CONTAINER_ELEMENT.onpointerup = e =>
    {
        //Stop from dragging on text
        e.preventDefault();
        mouseDown = false;

        //Position when pressed
        mouseUpCanvasPosition = Victor(e.clientX, e.clientY).subtract(APP_CLIENT_POSITION);
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
const SCENE_ID = Object.freeze({ Menu: 0, Game: 1 });

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

//#region Audio Manager

/**
 * The sound effects in the game
 * @type {Howl[]}
 */
const SFX = [];

/**
 * An "enum" for the sound effect names
 */
const SFX_ID = Object.freeze
({
    Select: 0,
    Swipe: 1,
    Back: 2,
    Aim: 3,
    Fling: 4,
    Orb: 5,
    Spike: 6,
    Death: 7
});

/**
 * Initializes all audio
 */
const loadAudio = () =>
{
    //Initialize sound effects
    for(const soundName in SFX_ID)
    {
        importSfx(soundName);
    }

    //Initialize music (if there was any)
}

/**
 * The directory for all audio files
 * @type {string}
 */
const audioDirectory = "assets/audio/";

/**
 * The directory for all sound effects
 * @type {string}
 */
const sfxDirectory = audioDirectory + "sfx/";

/**
 * Imports the specified sfx
 * @param {string} soundName The file name excluding the extension
 */
const importSfx = soundName =>
{
    SFX[SFX_ID[soundName]] = new Howl({src: [sfxDirectory + soundName + ".wav"]});
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

    //Load audio
    loadAudio();

    //Start the game
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
    //Initialize the player
    PLAYER = new Player();

    //Initialize the objects
    initializeOjects(10, 7);

    //Add all the objects to the scene
    for(const object of OBJECTS)
    {
        gameScene.addChild(object);
    }

    //DEBUG this should not be called here, rather it should be called when start is pressed
    //Set the game up
    resetGame();
}

/**
 * Updates the game scene
 */
const updateGame = () =>
{
    //Follow player when not aiming
    CAMERA.easeTo(PLAYER.vectorPosition, CAMERA_ZOOM_DEFAULT, CAMERA_EASING_FACTOR);
    
    //Update camera
    CAMERA.update();
    updateInputManager();
    

    /*-----Ending tasks of update, nothing past here-----*/

    //Update physics manager
    updatePhysicsManager();

    //Update all physics objects
    updateObjects();
}

/**
 * Resets everything in the game to starting values
 */
const resetGame = () =>
{
    //Reset player
    PLAYER.reset();

    //Reset camera
    CAMERA.zoom = CAMERA_ZOOM_DEFAULT;
    CAMERA.position = CAMERA_POSITION_DEFAULT;

    //Compute the matrix and bounding rectangle
    CAMERA.computeMatrix();

    //Reset other physics objects
    resetObjects(CAMERA.boundingRectangle);
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
 * Generates a random number from 0 to the specified maximum
 * @param {number} max Max inclusive
 * @returns {number} A random number from 0 to the specified max
 */
const random = max => Math.random() * max;

/**
 * Generates a random number within the specified range
 * @param {number} min Min inclusive
 * @param {number} max Max inclusive
 * @returns {number} A random number within the specified range
 */
const randomRange = (min, max) => random(max - min) + min;


/**
 * Generates a random vector within the specified bounds
 * @param {PIXI.Rectangle} bounds The bounds within which the vector should be generated
 * @returns {Victor} The randomly generated vector
 */
const randomRange2D = bounds =>
    Victor(randomRange(bounds.x, bounds.right), randomRange(bounds.y, bounds.bottom));

/**
 * Checks if the specified decomposed circles are colliding
 * @param {Victor} p1 The position of the first circle
 * @param {number} r1 The radius of the first circle
 * @param {Victor} p2 The position of the second circle
 * @param {number} r2 The radius of the second circle
 * @returns {boolean} TRUE if the circles are colliding
 */
const isColliding = (p1, r1, p2, r2) =>
{
    //Use distance squared to avoid the square root
    const radiusTotal = r1 + r2;
    return p1.distanceSq(p2) < radiusTotal * radiusTotal;
}

//#endregion
