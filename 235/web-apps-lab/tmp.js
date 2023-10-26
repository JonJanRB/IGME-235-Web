"use strict";
let colors = ["indigo","yellow","gray","purple","black"];
let foods = ["penne vodka sauce", "reuben", "mac and cheese", "ramen", "sushi"]; // add some foods

// Optional - can you figure out how to pull both the key AND the value
// from the `links` object literal?
let links = {
    "RIT": "http://www.rit.edu",
    "RWAG" : "https://www.facebook.com/RWAGclub",
    "New Media Club" : "http://newmediaclub.cias.rit.edu"
}   


// /**
//  * I like doing this because specifying type based languages are better imo
//  * @param {Element} listElement 
//  * @param {Array} array 
//  */
// function createList(listElement, array = ["puppydogs", "butterflies", "lollipops"])
// {
//     for(let item of array)
//     {
//         const li = document.createElement("li");
//         li.innerHTML = item;
//         listElement.appendChild(li);
//     }
// }

// /**
//  * Using let
//  * @param {Element} listElement 
//  * @param {Array} array 
//  */
// let createList = function(listElement, array = ["puppydogs", "butterflies", "lollipops"])
// {
//     for(let item of array)
//     {
//         const li = document.createElement("li");
//         li.innerHTML = item;
//         listElement.appendChild(li);
//     }
// }

/**
 * Arrow
 * @param {Element} listElement 
 * @param {Array} array 
 */
let createList = (listElement, array = ["puppydogs", "butterflies", "lollipops"]) =>
{
    for(let item of array)
    {
        const li = document.createElement("li");
        li.innerHTML = item;
        listElement.appendChild(li);
    }
}



createList(document.querySelector("#colorsList"), colors);
createList(document.querySelector("#foodsList"), foods);


const linksOrderedList = document.querySelector("#linksList");
for(let link in links)
{
    const li = document.createElement("li");
    li.innerHTML = `<a href="${links[link]}">${link}</a>`;
    linksOrderedList.appendChild(li);
}



