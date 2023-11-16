"use strict";

//#region Initial Stuff

const API_BASE_URL = "https://api.jikan.moe/v4/";

//The container to put the seasonal buttons in
let seasonalContainer;

//The container to put the anime in
let animeContainer;

/**
 * Initialization function
 */
const init = () =>
{
    //Initialize "constant" element values
    seasonalContainer = document.querySelector("#containerSeasonal");
    animeContainer = document.querySelector("#containerAnime");

    populateSeasonal();
    showCurrentSeason();
}
window.onload = init;

//#endregion

//#region Seasonal

/**
 * adds buttons to view all seasons available
 */
const populateSeasonal = () =>
//Request inline like this
requestData
(
    "seasons",
    /**
     * Success function adds all listed seasons to sidebar
     * @param {Event} e the api response
     */
    e =>
    {
        //The parsed json response from the api
        const result = parseResponseEvent(e);

        //Check if there are no results or errors
        if(!result || result.status == 404 || !result.data || result.data.length == 0)
        {
            seasonalContainer.innerHTML = "No seasons found.";
            return;
        }

        //Clear the conatiner
        seasonalContainer.innerHTML = "";

        //The year dropdown
        const dropdownYear = document.createElement("select");

        //Format the results
        for(const seasonYear of result.data)
        {
            const yearOption = document.createElement("option");
            yearOption.value = seasonYear.year;
            yearOption.innerText = seasonYear.year;

            //Old

            //Header
            //So funny thing, I can't use innerHTML here because it removes the
            //onclick events that I add below
            // seasonalContainer.innerHTML += `<h3>${seasonYear.year}</h3>`;
            const header = document.createElement("h4");
            header.textContent = seasonYear.year;
            seasonalContainer.append(header);

            //Add each season of current year
            for(const seasonType of seasonYear.seasons)
            {
                //Create a button with the data needed to make it functional
                const seasonButton = document.createElement("button");
                seasonButton.type = "button";
                seasonButton.classList.add("seasonalButton");
                seasonButton.dataset.year = seasonYear.year;
                seasonButton.dataset.season = seasonType;
                seasonButton.innerText = seasonType;
                //Request based on season
                //Old way of doing event listeners before I did event delegation
                // seasonButton.onclick = onSeasonClick;
                seasonalContainer.append(seasonButton);
                
            }
        }
        //ChatGPT suggested using event delegation and it seems
        //cleaner and more reliable than the above code
        //https://javascript.info/event-delegation
        //Make all seasonal buttons call their click function on click
        seasonalContainer.onclick = event =>
        {
            //Could also use event.target.matches("button.seasonalButton")
            if(event.target.classList.contains("seasonalButton"))
                onSeasonClick(event);
        };
    },
    onFail,
    seasonalContainer
);

const onSeasonClick = e =>
{
    console.log("object");
    showSeason(e.target.dataset.year, e.target.dataset.season);
};

/**
 * Displays the specified season ith the specified parameters
 * @param {number} year year of the season
 * @param {string} season season time (winter, spring, etc)
 */
const showSeason = (year, season) => requestAndDisplay(`seasons/${year}/${season}`);

/**
 * Displays the current season of anime
 */
const showCurrentSeason = () => requestAndDisplay("seasons/now");

//#endregion

//#region Helper Functions

/**
 * Requests data from the specified url and calls the specified fail or success functions
 * @param {string} urlExtension the url extension to request from (anime/{id})
 * @param {Function} onSuccess runs on successful get
 * @param {Function} onFail runs on failed get
 * @param {Element} loadingContainer the container to add a loading animation to
 */
const requestData = (urlExtension, onSuccess, onFail, loadingContainer) =>
{
    //create a new xhr object
    const xhr = new XMLHttpRequest();

    //set the onload handler
    xhr.onload = onSuccess;

    //set the onerror handler
    xhr.onerror = onFail;

    //Add loading animation
    loadingContainer.innerHTML = "LoAdInG placeholder";//TODO

    //open connection and send the request
    xhr.open("GET", API_BASE_URL + urlExtension);
    xhr.send();
}

/**
 * Parses the api response specified event
 * @param {Event} e the api response event
 * @returns {object} the parsed object from the api
 */
const parseResponseEvent = e => JSON.parse(e.target.responseText);

/**
 * Adds anime to the content from the specified array of anime
 * @param {Array} animes 
 */
const setAnimeFromArray = animes =>
{
    //Clear container
    animeContainer.innerHTML = "";
    for(let anime of animes)
    {
        animeContainer.append(createAnimeElement(anime));
    }
}

/**
 * Creates an anime element from the specified anime object
 * @param {object} anime object that jikan returns as an anime
 * @returns {Element} the element
 */
const createAnimeElement = anime =>
{
    const animeElement = document.createElement("article");
    animeElement.classList.add("anime");
    
    //Titles
    animeElement.innerHTML += `<h4>${anime.title}</h4><h5>${anime.title_english}</h5>`;

    //Cover image
    animeElement.innerHTML +=
        `<img src="${anime.images.jpg.image_url}" alt='Cover image for "${anime.title}"'>`;
    
    //Summary
    animeElement.innerHTML += `<p>${anime.synopsis}</p>`;
    animeElement.innerHTML += `<a href="${anime.url}" target="_blank">View in MAL</a>`;
    
    //Return the element
    return animeElement;
}

/**
 * Fail function
 * @param {Event} e 
 */
const onFail = e =>
{
    console.log("Error occured: ", e.target);
    seasonalContainer.innerHTML = "An error occured. Check console.";
}

/**
 * Requests then displays the requested data
 * @param {string} urlExtension 
 */
const requestAndDisplay = urlExtension =>
{
    requestData
    (
        urlExtension,
        /**
         * Success function displays the current season
         * @param {Event} e the api response
         */
        e => setAnimeFromArray(parseResponseEvent(e).data),
        onFail,
        animeContainer
    );
}

//#endregion