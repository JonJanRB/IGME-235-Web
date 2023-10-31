"use strict";

// Tips: onchange, onclick
// attribute selector: input[name='colorGroup']
// get all the things (legend, radios, btn, para)

let init = function()
{
    let buttons = document.querySelectorAll("input");
    for(let button of buttons)
    {
        button.onclick = selection;
    }
}

// JQuery was made by a cs student at RIT !?
window.onload = init;
// window.addEventListener("load", init); //Another way to do this



let selection = colorName =>
{
    console.log(colorName);
}