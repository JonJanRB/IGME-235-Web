// import * as PIXI from './pixi.js';
"use strict";

//#region Global Variables

//Constants and unchanging variables
const APP_WIDTH = 500;
const APP_HEIGHT = 750;
const APP = new PIXI.Application({width: APP_WIDTH, height: APP_HEIGHT});
const STAGE = APP.stage;
let ASSETS;


//#endregion

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
    ASSETS = await PIXI.Assets.loadBundle('sprites');
    start();
}

/**
 * Starts the game 
 */
const start = () =>
{
    STAGE.addChild(new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, APP_WIDTH/2, APP_HEIGHT/2));
}
