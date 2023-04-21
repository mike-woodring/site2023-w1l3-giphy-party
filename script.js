// Global Constants
const apiConsts = {
  "apiKey": "x8JFFqzsEjbSQ5RvMii5NgNcVP2b1iDI",
  "limit": 5,
  "rating": 'G',
  "offset": 0,
  "lang": "en",
  "searchUrlBase": "https://api.giphy.com/v1/gifs/search"
};

function qsa(argName, argValue) {
  return `${argName}=${argValue}`;
}

function getSearchUrl(searchTerm) {
  let url = `${apiConsts.searchUrlBase}?${qsa("api_key", apiConsts.apiKey)}&limit=${apiConsts.limit}&offset=${apiState.offset}&${qsa("q", searchTerm)}`;

  console.log({
    "context": `getSearchUrl(${searchTerm})`,
    "returning": `${url}`
  });
  
  return(url);
}

const pageElements = {
  "searchForm": document.querySelector("#search-form"),
  "searchTerm": document.querySelector("#search-term"),
  "searchButton": document.querySelector("#search-button"),
  "searchResults": document.querySelector("#search-results"),
  "showMoreButton": document.querySelector("#show-more")
};

let apiState = {
  "offset": 0,
  "pagination": null
}

/**
 * Update the DOM to display results from the Giphy API query.
 *
 * @param {Object} results - An array of results containing each item
 *                           returned by the response from the Giphy API.
 *
 */
function displayResults(results) {
  // YOUR CODE HERE

  console.log({
    "context": "displayResults.entry",
    "results": results
  });

  let resultsHTML = "";

  results.forEach(img => {
    resultsHTML += `
      <p>
        <img src="${img.images.original.url}"/>
      </p>
    `
  });

  console.log({
    "context": "displayResults.resultsHTML",
    "resultsHTML": resultsHTML
  });

  pageElements.searchResults.innerHTML += resultsHTML;
}

/**
 * Make the actual `fetch` request to the Giphy API
 * and appropriately handle the response.
 *
 * @param {String} searchTerm - The user input text used as the search query
 *
 */

async function getGiphyApiResults(searchTerm) {
  // YOUR CODE HERE
  const searchUrl = getSearchUrl(searchTerm);

  console.log({
    "context": "getGiphyApiResults.entry",
    "searchTerm": searchTerm,
    "searchUrl": searchUrl
  });

  const json = await fetch(searchUrl)
    .then(r => r.json())

  console.log({
    "context": "getGiphyApiResults.after await response.json()",
    "json": json
  });

  apiState.pagination = json.pagination;

  return json;
}

/**
 * The function responsible for handling all form submission events.
 *
 * @param {SubmitEvent} event - The SubmitEvent triggered when submitting the form
 *
 */
async function handleFormSubmit(event) {
  // YOUR CODE HERE
  event.preventDefault();

  console.log({
    "context": "handleFormSubmit.entry",
    "event": event
  });

  apiState.offset = 0;

  const results = await getGiphyApiResults(pageElements.searchTerm.getAttribute('value'));

  console.log({
    "context": "handleFormSubmit.after call to getGiphyApiResults",
    "results": results
  });

  apiState.pagination = results.pagination;

  displayResults(results.data)

  console.log({
    "context": "handleFormSubmit.exit",
    "apiState": apiState,
    "pageElements.showMoreButton.classList": pageElements.showMoreButton.classList
  });

  pageElements.showMoreButton.classList.remove("hidden");
}

/**
 * Handle fetching the next set of results from the Giphy API
 * using the same search term from the previous query.
 *
 * @param {MouseEvent} event - The 'click' MouseEvent triggered by clicking the 'Show more' button
 *
 */
async function handleShowMore(event) {
  // YOUR CODE HERE

  console.log({
    "context": "handleShowMore.before call to getGiphyApiResults",
    "apiState": apiState
  });

  if (apiState.pagination) {
    apiState.offset += apiState.pagination.count;
  }

  const results = await getGiphyApiResults(pageElements.searchTerm.getAttribute('value'));

  console.log({
    "context": "handleShowMore.after call to getGiphyApiResults",
    "results": results
  });

  displayResults(results.data)
}

window.onload = () => {
  // YOUR CODE HERE
  // Add any event handlers here

  console.log({
    "context": "window.onload",
    "pageElements": pageElements
  });

  pageElements.searchForm.addEventListener("submit", async function (ev) {
    handleFormSubmit(ev);
  });

  pageElements.showMoreButton.addEventListener("click", async function (ev) {
    handleShowMore(ev);
  });
}
