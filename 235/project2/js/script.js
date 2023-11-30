//#region Initial Stuff

"use strict";

const API_BASE_URL = "https://api.jikan.moe/v4/";
const CURRENT_DATE = new Date();

//The container to put the whole seasonal filter in
let seasonalContainer;
//The container to put the seasonal buttons in
let seasonButtonContainer;
//The parsed results of the seasons list requested from jikan
let seasonListResponse;

//The the search bar element
let searchBar;

//The container to put the anime in
let animeContainer;

//The container to put the genre filter in
let genreContainer;

//The dropdown menu of genres
let dropdownGenre;

//The list of genres
let genreListResponse;

//The advanced search button
let advancedSearchButton;

//The advanced search bar
let advancedSearchBar;


//URL Extensions
const GENRE_EXTENSION = "genres/anime";
const SEASONS_EXTENSION = "seasons";
const CURRENT_SEASON_EXTENSION = "seasons/now?sfw";
const SEARCH_EXTENSION = "anime?sfw";


/**
 * Initialization function
 */
window.onload = () =>
{
    setupFoldables();

    //Initialize "constant" element values
    seasonalContainer = document.querySelector("#containerSeasonal");
    animeContainer = document.querySelector("#containerAnime");
    searchBar = document.querySelector("#searchBar");
    genreContainer = document.querySelector("#containerGenre");
    advancedSearchButton = document.querySelector("#advancedSearchButton");
    advancedSearchBar = document.querySelector("#advancedSearchBar");

    populateSeasonalYears();
    populateGenreList();
    setupAdvancedSearchButton();
    setupSearch();

    //Lastly load the current season
    showCurrentSeason();
};

/**
 * Sets up the foldable elements
 */
const setupFoldables = () =>
{
    const foldables = document.querySelectorAll(".foldable");
    const foldableHeaders = document.querySelectorAll(".foldableHeader");

    for(const header of foldableHeaders)
    {
        //Make sure there are no duplicates of the arrow
        //(in case of refresh by calling this again such as during an error which is foldable)
        const allPInHead = header.querySelectorAll("p");
        for(const p of allPInHead)
        {
            if(p.innerText == "▼") p.remove();
        }

        header.append(createElement("p", { innerText: "▼" }));

        //Styling state
        header.onclick = e =>
        {
            //Get the parent foldable element
            const foldableParent = e.target.closest(".foldable");
            const foldableParentClassList = foldableParent.classList;

            //Only do it if it is folded
            if(foldableParentClassList.contains("folded"))
            {
                //Get all the sibling foldables and fold them
                const localFoldables = foldableParent.parentElement.querySelectorAll(".foldable");
                for(const localFoldable of localFoldables)
                {
                    foldElement(localFoldable.classList);
                }
            }
            //Then toggle the clicked one
            toggleFoldable(foldableParentClassList);
        }

        header.onmouseenter = e =>
        {
            //Get the parent foldable element
            const foldableParent = e.target.closest(".foldable");
            const foldableParentClassList = foldableParent.classList;

            foldableParentClassList.add("foldPeek");
        }
        header.onmouseleave = e =>
        {
            //Get the parent foldable element
            const foldableParent = e.target.closest(".foldable");
            const foldableParentClassList = foldableParent.classList;

            foldableParentClassList.remove("foldPeek");
        }
    }

    // for(const foldable of foldables)
    // {
    //     //Add states for styling
    //     foldable.onmouseenter = e =>
    //     {
    //         // if(e.target.classList.contains("folded"))
    //         {
    //             e.target.classList.add("foldPeek");
    //         }
    //     }
    //     foldable.onmouseleave = e =>
    //     {
    //         e.target.classList.remove("foldPeek");
    //     }
    // }
}

/**
 * Sets the state of the specified foldable element's class list to folded
 * @param {DOMTokenList} foldableParentClassList the classlist of the foldable parent
 */
const foldElement = foldableParentClassList =>
{
    foldableParentClassList.remove("unfolded");
    foldableParentClassList.add("folded");
}

/**
 * Sets the state of the specified foldable element's class list to unfolded
 * @param {DOMTokenList} foldableParentClassList the classlist of the foldable parent
 */
const unfoldElement = foldableParentClassList =>
{
    foldableParentClassList.remove("folded");
    foldableParentClassList.add("unfolded");
    //Also remove the peek state if possible
    // foldableParentClassList.remove("foldPeek");
}

/**
 * Toggles the state of the specified foldable element's class list
 * @param {DOMTokenList} foldableParentClassList 
 */
const toggleFoldable = foldableParentClassList =>
{
    if(foldableParentClassList.contains("folded"))
        unfoldElement(foldableParentClassList);
    else
        foldElement(foldableParentClassList);
}

//#endregion

//#region Seasonal

/**
 * Creates a dropdown for all seasonal years.
 * Requests the season list and stores it for later use.
 */
const populateSeasonalYears = () => requestData
(
    SEASONS_EXTENSION,
    /**
     * Success function adds all listed seasons to sidebar
     * @param {Event} e the api response
     */
    e =>
    {
        //Evaluate if the response worked
        seasonListResponse = evaluateResponse(e, seasonalContainer, "No seasons found.", SEASONS_EXTENSION);

        //If it returned null, there was an error
        if(!seasonListResponse) return;

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
    e => evaluateResponse(e, seasonalContainer, "No seasons found.", SEASONS_EXTENSION),
    seasonalContainer
);

/**
 * Displays the specified season ith the specified parameters
 * @param {number} year year of the season
 * @param {string} season season time (winter, spring, etc)
 */
const showSeason = (year, season) => requestAndDisplay(`seasons/${year}/${season}?sfw`);

/**
 * Displays the current season of anime
 */
const showCurrentSeason = () => requestAndDisplay(CURRENT_SEASON_EXTENSION);

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
        tryAppend
        (
            seasonButtonContainer, "button", [seasonType],
            { type: "button", innerText: seasonType},
            ["seasonalButton"],
            { year: seasonYear.year, season: seasonType }
        );
    }
}

//#endregion

//#region General Searching

/**
 * sets the search bar up
 */
const setupSearch = () =>
{
    /**
     * searches when enter is released
     * @param {Event} e the key up event
     */
    searchBar.onkeyup = e => { if(e.code === "Enter") search(e.target.value) }
};

/**
 * Searches using the search term and filters
 * @param {string} searchTerm the term to search for
 * @param {object} parameters an object containing query parameters
 */
const search = (searchTerm, parameters) =>
{
    //Add the parameters to the request
    let finalRequest = SEARCH_EXTENSION + "&q=" + searchTerm;
    for(const param in parameters)
    {
        finalRequest += "&" + param + "=" + parameters[param];
    }
    requestAndDisplay(finalRequest);
}

//#endregion

//#region Advanced Search

//#region Genre

/**
 * Creates a dropdown for all genres
 * Requests the genre list and stores it for later use
 * 
 * Actually, the api can take in multiple genres so it would have been
 * better to have a checklist but I didn't get to that
 */
const populateGenreList = () => requestData
(
    GENRE_EXTENSION,
    /**
     * Success function adds all listed genres to sidebar
     * @param {Event} e the api response
     */
    e =>
    {
        //Evaluate if the response worked
        genreListResponse = evaluateResponse(e, genreContainer, "No genres found.", GENRE_EXTENSION);

        //If it returned null, there was an error
        if(!genreListResponse) return;

        //The genre dropdown
        dropdownGenre = createElement("select", { id: "genreFilter" });

        //Add all the genres to a dropdown menu
        for(let i = 0; i < genreListResponse.data.length; i++)
        {
            const genre = genreListResponse.data[i];
            //Make the value the index for easy retrival later
            const genreOption = createElement("option",
            {
                value: i,
                innerText: genre.name
            });
            dropdownGenre.append(genreOption);
        }

        //Append the elements
        genreContainer.append(dropdownGenre);
    },
    e => evaluateResponse(e, genreContainer, "No genres found.", GENRE_EXTENSION),
    genreContainer
);

//#endregion

const setupAdvancedSearchButton = () =>
{
    //Advanced search when the button is clicked or enter is pressed within the search bar
    advancedSearchButton.onclick = advancedSearchSubmit;
    advancedSearchBar.onkeyup = e => { if(e.code === "Enter") advancedSearchSubmit(); }
}



const advancedSearchSubmit = () =>
{
    search(advancedSearchBar.value, { genres: dropdownGenre.value });
}

//#endregion

//#region Anime Content

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
 * @returns {HTMLElement} the element
 */
const createAnimeElement = anime =>
{
    //Create an article with the anime class
    const ani = createElement("article", {}, ["anime"]);
    
    //Titles

    //Create a header group
    const titleGroup = document.createElement("hgroup");
    //Add headers to the group
    tryAppend(titleGroup, "h2", [anime.title], { innerText: anime.title });
    tryAppend(titleGroup, "h3", [anime.title_english], { innerText: anime.title_english });
    //Add the group to the article
    ani.append(titleGroup);

    //Cover image
    tryAppend(ani, "img", [anime.images.jpg.image_url, anime.title],
        { src: anime.images.jpg.image_url, alt: 'Cover image for "${anime.title}"' });
    
    //Summary
    tryAppend(ani, "p", [anime.synopsis], { innerText: anime.synopsis });

    //Link to MAL
    // tryAppend(ani, "a", [anime.url], { href: anime.url, target: "_blank", innerText: "View in MAL" });
    // let dragged = false;
    ani.onclick = e =>
    {
        // console.log(e.target.dataset.dragged);
        // if(!e.target.dataset.dragged)
        window.open(anime.url, "_blank");
    }

    //Return the element
    return ani;
}

//#endregion

//#region Helper Functions

/**
 * Requests data from the specified url and calls the specified fail or success functions
 * @param {string} urlExtension the url extension to request from (anime/{id})
 * @param {Function} onSuccess runs on successful get
 * @param {Function} onFail runs on failed get
 * @param {HTMLElement} loadingContainer the container to add a loading animation to
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
    loadingContainer.innerHTML = "LOADING";//TODO

    //open connection and send the request
    const fullURL = getFullAPIURL(urlExtension);
    // console.log("Requesting: " + fullURL);//DEBUG
    xhr.open("GET", fullURL);
    xhr.send();
}

/**
 * Returns the full api url with the specified extension
 * @param {string} urlExtension The url extension to add to the base url
 * @returns The full api url
 */
const getFullAPIURL = urlExtension => API_BASE_URL + urlExtension;

/**
 * Parses the api response specified event
 * @param {Event} e the api response event
 * @returns {object} the parsed object from the api
 */
const parseResponseEvent = e => JSON.parse(e.target.responseText);

/**
 * Displays the specified error messages in the specified container
 * @param {Event} e The raw response, most likely unreadable but will be logged
 * @param {HTMLElement} container The container to display the error
 * @param {string} errorMessage The main error message
 * @param {Array} subMessage The sub-error messages to display if provided
 */
const displayErrorMessage = (e, container, errorMessage, subMessage = null) =>
{
    console.log("Error occured: ", e.target);
    clearElement(container);
    const errorContainer = createElement("div", {}, ["errorContainer", "foldable", "folded"]);
    tryAppend(errorContainer, "p", [errorMessage], { innerText: errorMessage }, ["mainError", "foldableHeader"]);
    const errorFoldBody = createElement("div", {}, ["foldableBody"]);
    for(const message of subMessage)
    {
        tryAppend(errorFoldBody, "p", [subMessage], { innerText: message }, ["subError"]);
    }
    errorContainer.append(errorFoldBody);
    container.append(errorContainer);
    
    //Refresh foldables so they all have functionality
    setupFoldables();
}

/**
 * Requests then displays the requested data
 * @param {string} urlExtension 
 */
const requestAndDisplay = urlExtension => requestData
(
    urlExtension,
    /**
     * Success function displays the current season
     * @param {Event} e the api response
     */
    e =>
    {
        //Evaluate if the response worked
        const response = evaluateResponse(e, animeContainer, "No anime found.", urlExtension);
        if(!response) return;

        //This is a valid response without any data, therefore no error
        if(response.data.length == 0)
        {
            clearElement(animeContainer);
            animeContainer.append(createElement("p", { innerText: "No anime found." }));
            return;
        }
        //If it gets here, there is valid data to display
        setAnimeFromArray(response.data);
    },
    e => evaluateResponse(e, animeContainer, "No anime found.", urlExtension),
    animeContainer
);

/**
 * Evaluates the api response and displays an error message if needed
 * @param {Event} e The response event to evaluate
 * @param {HTMLElement} container The container to put the error message in
 * @param {string} errorMessage The error message to display
 * @param {string} apiExtensionURL The extension of the api request sent
 * @returns The response is valid or null if there was an error
 */
const evaluateResponse = (e, container, errorMessage, apiExtensionURL) =>
{
    //The parsed json response from the api
    const response = parseResponseEvent(e);
    clearElement(container);

    //Check if there are no results or errors
    if(!response || (response.status && response.status != 200) ||
        !response.data)
    {
        displayErrorMessage(e, container, errorMessage,
        [
            "Status: " + response.status,
            "Type: " + response.type,
            "Message: " + response.message,
            "Error: " + response.error,
            "Report URL: " + response.report_url,
            "Sent Request URL: " + getFullAPIURL(apiExtensionURL)
        ]);
        return null;
    }
    return response;
}
//#endregion

//#region Element Extensions

/**
 * Creates an element from the specified type and standard attributes. Non-standard attributes,
 * datasets, classes, etc need to be added outside
 * @param {string} elementType the type of element to create
 * @param {object} attributes an object that contains key value pairs of attributes.
 * Only works with standard attributes,
 * @param {Array} classes a list of classes to add if needed
 * @param {object} datasets a list of datasets to add if needed
 * @param {object} nonStandardAttributes a list of non-standard attributes to add if needed
 * @returns {HTMLElement} the created element
 */
const createElement = (elementType, attributes,
    classes = [], datasets = {}, nonStandardAttributes = {}) =>
{
    //Create the element from the specified type
    const element = document.createElement(elementType);
    
    //Add the attributes based on the object properties
    //Use bracket notation to access the property (weird)
    for(let attribute in attributes) element[attribute] = attributes[attribute];

    //Add classes
    for(let className of classes) element.classList.add(className);

    //Add datasets
    for(let dataName in datasets) element.dataset[dataName] = datasets[dataName];

    //Add nonstandards
    for(let attribute in nonStandardAttributes)
        element.setAttribute(attribute, nonStandardAttributes[attribute]);

    return element;
}

/**
 * Appends the specified innner element to the outer element only if the specified data is valid
 * @param {Array} data the data you want to validate
 * @param {string} innerElementType the type of element you want to create and customize
 * @param {object} attributes an object that contains key value pairs of attributes
 * to add to the inner element
 * @param {HTMLElement} outerElement the element to append the inner element to
 * @param {Array} classes a list of classes to add if needed
 * @param {object} datasets a list of datasets to add if needed
 * @param {object} nonStandardAttributes a list of non-standard attributes to add if needed
 * @returns {boolean} TRUE when the data is valid
 */
const tryAppend = (outerElement, innerElementType, data, attributes,
    classes = [], datasets = {}, nonStandardAttributes = {}) =>
{
    //If any data included is null, it will not create the element
    for(let dataPeice of data) if(dataPeice === null) return false;

    //Append the element to the parent (outer element)
    outerElement.append(
        createElement(innerElementType, attributes, classes, datasets, nonStandardAttributes));
    return true;
}

/**
 * Clears all inner html of the specified element
 * @param {HTMLElement} element element to clear
 */
const clearElement = element => element.innerHTML = "";

//#endregion