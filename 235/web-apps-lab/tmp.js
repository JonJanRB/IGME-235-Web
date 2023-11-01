"use strict";

// Tips: onchange, onclick
// attribute selector: input[name='colorGroup']
// get all the things (legend, radios, btn, para)
// JQuery was made by a cs student at RIT !?

let init = function()
{
    let buttons = document.querySelectorAll("input");
    for(let button of buttons)
    {
        //These will both do the same thing and pass the Event obj as 1st param
        button.onchange = select;
        // button.addEventListener("change", selection);
    }
    document.querySelector("#colorButton").addEventListener("click", submit);
}
window.onload = init;
// window.addEventListener("load", init); //Another way to do this


/**
 * 
 * @param {Event} e 
 */
let select = e =>
{
    document.querySelector("#info").innerHTML = `You have selected "${e.target.value}"!`;

    //One way to store data in an html element
    // e.target.dataset.selectedStatus = "selected";
}


//Another way to make function (I'm just playing around with these to get used to them)
let submit = function()
{
    let selectedColor;

    let buttons = document.querySelectorAll("input");
    for(let button of buttons)
    {
        if(button.checked)
        {
            selectedColor = button.value;
            break;//More efficient
        }
    }

    document.querySelector("legend").style.color = selectedColor;
    //This only changes the non element stuff within the element compared to innerHTML (if I understand right)
    document.querySelector("#info").textContent = `Your FINAL CHOICE is "${selectedColor}"!`;
}