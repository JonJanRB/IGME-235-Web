"use string";

window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
let displayTerm = "";

function searchButtonClicked()
{
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    //public API key from here: https://developers.giphy.com/docs/
    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

    //build up our URL string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    //parse the user entered term we wish to search
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //get rid of any leading and trailing spaces
    term = term.trim();

    //encode spaces and special characters
    term = encodeURIComponent(term);

    //if there's no term to search then bail out of the function (return does this)
    if(term.length < 1) return;
    
    //append the search term to the URL - the parameter name is 'q'
    url += "&q=" + term;

    //grab the user chosen search "limit' from the ‹select> and append it to the URL
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;
    
    //update the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    //request data
    getData(url);
}

function getData(url)
{
    //create a new xhr object
    let xhr = new XMLHttpRequest();

    //set the onload handler
    xhr.onload = dataLoaded;

    //set the onerror handler
    xhr.onerror = dataError;

    //open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e)
{
    //event.target is the xhr object
    let xhr = e.target;

    //turn the text into a parsable js object
    let obj = JSON.parse(xhr.responseText);

    //if there are no results, print  message and return
    if(!obj.data || obj.data.length == 0)
    {
        document.querySelector("#status").innerHTML = `<b>No results found for '${displayTerm}'</b>`;
        return; //Bail out
    }

    //start building an HTML string we will display to the user
    let results = obj.data;
    console.log("results.length = " + results.length);

    let bigString = "";

    //loop through the array of results
    for(let i = 0; i < results.length; i++)
    {
        let result = results[i];

        //get the url to the gif
        let smallURL = result.images.fixed_width.url;
        if(!smallURL) smallURL = "images/no-image-found.png";

        //get the url to the giphy page
        let url = result.url;

        let line = `<div class="result">Rating: ${result.rating.toUpperCase()}
            <img src="${smallURL}" title="${result.id}"><span>
            <a target="_blank" href="${url}">View on Giphy</a></span></div>`;


        bigString += line;
    }

    //all done building the html, show to user
    document.querySelector("#content").innerHTML = bigString;

    //update the status
    document.querySelector("#status").innerHTML = "<b>Success!</b>";
    document.querySelector("#status").innerHTML += `<p><i>Here are ${results.length} results for ${displayTerm}</i></p>`;
}

function dataError(e)
{
    console.log("An error occured");
}
