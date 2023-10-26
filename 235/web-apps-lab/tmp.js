"use strict";

// add your own code here.

document.querySelector("h1").innerHTML = "My UFO Page";
document.querySelector("h2").innerHTML = "My UFO Info";
//Using css selector to grab specific index
document.querySelector("h2:nth-of-type(2)").innerHTML = "My UFO Pictures";
//Using the selector all and using its array structure
document.querySelectorAll("h2")[2].innerHTML = "";

document.body.style.fontFamily = "sans-serif";
document.body.style.color = "#FF2255";

const firstParagraph = document.querySelector("p");
firstParagraph.innerHTML = 'Report your UFO sightings here: <a href="https://nuforc.org/">https://nuforc.org/</a>';
firstParagraph.style.color = "green";
firstParagraph.style.fontWeight = "bold";
firstParagraph.style.fontSize = "2em";
firstParagraph.style.textTransform = "uppercase";
firstParagraph.style.textShadow = "3px 3px #A44";

document.querySelector("p:nth-of-type(2)").innerHTML = "";
document.querySelector("p:nth-of-type(3)").innerHTML = '<img src="https://s.abcnews.com/images/Politics/ufo-dod-navy-gty-jt-210604_1622833615977_hpMain_16x9_992.jpg" alt="cragy ufuoh omygah">';
document.querySelector("img").style.width = "500px";//It was too big
document.querySelector("footer").innerHTML = "&copy 2023 Jonathan Jan";
