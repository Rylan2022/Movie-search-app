"use static";

const api_key = "";
const imageBaseURL = "http://image.tmdb.org/t/p/";

/*
fetch data from a server using 'url' and passes the result in JSON data to a 'callback' function, along with an optional parameter if has 'optionalparam'.
*/

const fetchDataFromServer = function (url, callback, optionalparam) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data, optionalparam));
};

export { imageBaseURL, api_key, fetchDataFromServer };
