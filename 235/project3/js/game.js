import * as PIXI from './lib/pixi.js';
import * as Victor from './lib/victor.js';

"use strict";

//#region Classes

class PhysicsObject extends PIXI.Graphics
{
    constructor(radius, color = 0xFF0000, x = 0, y = 0)
    {
        super();

        //Properties (I love not having types (that is sarcasm))
        /**@type {number}*/this.color = color;
        //Collider
        /**@type {number}*/this.colliderRadius = 1;
        // /**@type {number}*/this.rotation = 0;

        this.beginFill(color);
        this.drawCircle(0, 0, radius);
        this.endFill();
        this.radius = radius;
        this.fwd = getRandomUnitVector();
        this.speed = 50;
        this.isAlive = true;
    }

    //"Properties"
    /**
     * Returns the position as a vector
     * @returns {Victor}
     */
    getPosition() { return Victor(super.x, super.y); }
    /**
     * Sets the position of this object
     * @param {Victor} position 
     */
    setPosition(position)
    {
        super.x = position.x;
        super.y = position.y;
    }
}

//#endregion

//#region Global Variables

//Constants and unchanging variables
const APP_WIDTH = 500;
const APP_HEIGHT = 750;
const APP = new PIXI.Application({width: APP_WIDTH, height: APP_HEIGHT});
const STAGE = APP.stage;
let ASSETS;


//#endregion

//#region Initialization

/**
 * Initial method for loading into the DOM
 */
const init = () =>
{
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
    STAGE.addChild(new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, APP_WIDTH/2, APP_HEIGHT/2));
}

//#endregion