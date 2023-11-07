// 1
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
// 2
let displayTerm = "";

// 3
function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    
}


///From class
//smallurl should be fixed_width_downsample instead of small

let line = `<div class="result">Rating: ${result.rating.toUpperCase()}<br><img src="${smallURL}" title="${resultID}">`