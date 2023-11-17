"use strict";

//#region Initial Stuff

const API_BASE_URL = "https://api.jikan.moe/v4/";
const CURRENT_DATE = new Date();

//The container to put the whole seasonal filter in
let seasonalContainer;
//The container to put the seasonal buttons in
let seasonButtonContainer;
//The parsed results of the seasons list requested from jikan
let seasonListResponse;

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

    populateSeasonalYears();
    showCurrentSeason();
}
window.onload = init;

//#endregion

//#region Seasonal

/**
 * Creates a dropdown for all seasonal years.
 * Requests the season list and stores it for later use.
 */
const populateSeasonalYears = () => requestData
(
    "seasons",
    /**
     * Success function adds all listed seasons to sidebar
     * @param {Event} e the api response
     */
    e =>
    {
        //The parsed json response from the api
        seasonListResponse = parseResponseEvent(e);

        //Check if there are no results or errors
        if(!seasonListResponse || seasonListResponse.status == 404 ||
            !seasonListResponse.data || seasonListResponse.data.length == 0)
        {
            seasonalContainer.innerHTML = "No seasons found.";
            return;
        }

        //Clear the conatiner
        clearElement(seasonalContainer);

        //Create the button container as soon as we know there is valid data
        seasonButtonContainer = document.createElement("div");

        //The year dropdown
        const dropdownYear = createElement("select",
        {
            //Add listener for changes in the year
            onchange: e => populateSeasonFilter(e.target.value)
        });

        //Add all the years to a dropdown menu
        for(let i = 0; i < seasonListResponse.data.length; i++)
        {
            const year = seasonListResponse.data[i].year;
            //Make the value the index for easy retrival later
            const yearOption = createElement("option",
            {
                value: i,
                innerText: year
            });
            dropdownYear.append(yearOption);

            //Check for the current year
            if(year == CURRENT_DATE.getFullYear())
            {
                dropdownYear.value = i;
                //Trigger the event rather than hard coding it in
                //[AI] Thanks to github copilot for this one
                dropdownYear.dispatchEvent(new Event("change"));
            }
        }

        //Append the elements
        seasonalContainer.append(dropdownYear);
        seasonalContainer.append(seasonButtonContainer);

        //[AI] ChatGPT suggested using event delegation and it seems
        //cleaner and more reliable than the above code
        //https://javascript.info/event-delegation
        //Make all seasonal buttons call their click function on click
        seasonButtonContainer.onclick = e =>
        {
            const seasonButton = e.target;
            //Could also use event.target.matches("button.seasonalButton")
            if(seasonButton.classList.contains("seasonalButton"))
                showSeason(seasonButton.dataset.year, seasonButton.dataset.season);
        };
    },
    genericFail,
    seasonalContainer
);

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

/**
 * Populates the seasonal filter based on the specified year
 * @param {number} yearIndex The index of the array gotten from the parsed data
 */
const populateSeasonFilter = yearIndex =>
{
    const seasonYear = seasonListResponse.data[yearIndex];

    clearElement(seasonButtonContainer);

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
        seasonButtonContainer.append(seasonButton);
    }
}

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
    clearElement(animeContainer);
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
const genericFail = e =>
{
    console.log("Error occured: ", e.target);
    seasonalContainer.innerHTML = "An error occured. Check console.";
}

/**
 * Requests then displays the requested data
 * @param {string} urlExtension 
 */
const requestAndDisplay = urlExtension =>
requestData
(
    urlExtension,
    /**
     * Success function displays the current season
     * @param {Event} e the api response
     */
    e => setAnimeFromArray(parseResponseEvent(e).data),
    genericFail,
    animeContainer
);

//#endregion

//#region Element extensions

/**
 * Appends the specified innner element 
 * @param {*} data the data you want to validate and put in the inner element
 * @param {string} innerElementType the type of element you want to create and customize
 * @param {object} attributes an object that contains key value pairs of attributes
 * to add to the inner element
 * @param {Element} outerElement the element to append the inner element to
 * @returns 
 */
const tryAppend = (data, innerElementType, attributes, outerElement) =>
{
    const innerElement = createElement(innerElementType, attributes);
    if(!data) return false;

    innerElementType.append(data);
    outerElement.append();
}

/**
 * Creates an element from the specified type and standard attributes. Non-standard attributes
 * and datasets need to be added outside
 * @param {string} elementType the type of element to create
 * @param {object} attributes an object that contains key value pairs of attributes.
 * Only works with standard attributes,
 * @returns the created element
 */
const createElement = (elementType, attributes) =>
{
    //Create the element from the specified type
    const element = document.createElement(elementType);
    
    //Add the attributes based on the object properties
    for(let attribute in attributes)
    {
        //Use bracket notation to access the property (weird)
        element[attribute] = attributes[attribute];
    }
    return element;
}

/**
 * Clears all inner html of the specified element
 * @param {Element} element element to clear
 */
const clearElement = element => element.innerHTML = "";

//#endregion