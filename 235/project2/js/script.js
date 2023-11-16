"use strict";

//#region Initial Stuff

const API_BASE_URL = "https://api.jikan.moe/v4/";

/**
 * Initialization function
 */
const init = () =>
{
    populateSeasonal();
}
window.onload = init;

//#endregion

//#region Seasonal

/**
 * adds buttons to view all seasons available
 */
const populateSeasonal = () =>
{
    //The container to put the seasonal buttons in
    const seasonalContainer = document.querySelector("#containerSeasonal");
    
    //Request inline like this
    requestData
    (
        "seasons",
        /**
         * Success function
         * @param {Event} e 
         */
        (e) =>
        {
            //The parsed json response from the api
            const result = JSON.parse(e.target.responseText);

            //Check if there are no results
            if(!result || !result.data || result.data.length == 0)
            {
                seasonalContainer.innerHTML = "No seasons found.";
                return;
            }

            //Clear the conatiner
            seasonalContainer.innerHTML = "";

            //Format the results
            for(const seasonYear of result.data)
            {
                //Header
                seasonalContainer.innerHTML += `<h3>${seasonYear.year}</h3>`;

                //Add each season of current year
                for(const seasonType of seasonYear.seasons)
                {
                    //Create a button with the data needed to make it functional
                    const seasonButton = document.createElement("button");
                    seasonButton.type = "button";
                    seasonButton.classList += "seasonalButton";
                    seasonButton.dataset.year = seasonYear.year;
                    seasonButton.dataset.season = seasonType;
                    seasonButton.innerText = seasonType;
                    //Request based on season
                    seasonButton.onclick = () =>
                    {
                        //TODO
                    }
                    seasonalContainer.append(seasonButton);
                }
            }
        },
        /**
         * Fail function
         * @param {Event} e 
         */
        (e) =>
        {
            console.log("Error occured: ", e.target);
            seasonalContainer.innerHTML = "An error occured. Check console.";
        },
        seasonalContainer
    );
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

//#endregion