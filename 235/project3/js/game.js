"use strict";

window.onload = () =>
{
    const app = new PIXI.Application({
        background: '#1099bb',
        resizeTo: window,
    });
    
    document.body.appendChild(app.view);
}
