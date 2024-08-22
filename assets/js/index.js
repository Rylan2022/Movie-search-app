"use strict";

/*
import all components and functions
*/

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

/**
 * fetch all genres eg: [ { "id": "123", "name": "Action"}]
 * then change genre formate eg: {123: "Action"}
 */
const genreList = {
  // create genre string from genre_id eg: [23, 43] ->   "Action, Romance"
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
      // this == genreList;
    }

    return newGenreList.join(", ");
  },
};

// fetchDataFromServer(
//   `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
//   function ({ genres }) {
//     for (const { id, name } of genres) {
//       genreList[id] = name;
//     }

//     fetchDataFromServer(
//       `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
//       heroBanner
//     );
//   }
// );

//? chatGPT 

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  function (response) {
    console.log(response); // Add this line to debug
    const { genres } = response;
    if (Array.isArray(genres)) {
      for (const { id, name } of genres) {
        genreList[id] = name;
      }
    } else {
      console.error("Genres is not an array", genres);
    }

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
      heroBanner
    );
  }
);







const heroBanner = function ({ result: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
      <div class="banner-slider"></div>

      <div class="slider-control">
        <div class="control-inner">
        </div>
      </div>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_data,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.classList.add("slider-item", "");

    sliderItem.innerHTML = `
        <img
          src="${imageBaseURL}w1280${backdrop_path}"
          alt="${title}"
          class="img-cover"
          loading=${index === 0 ? "eager" : "lazy"}
        />

        <div class="banner-content">
          <h2 class="heading">${title}</h2>

          <div class="meta-list">
            <div class="meta-item">${release_data.split("-")[0]}</div>

            <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>

            <p class="genre">${genreList.asString(genre_ids)}</p>
            <p class="banner-text">${overview}</p>

            <a href="./detail.html" class="btn">
              <img
                src="./assets/images/play_circle.png"
                width="24"
                height="24"
                aria-hidden="true"
                alt="play circle"
              />

              <span class="span">Watch Now</span>
            </a>
          </div>
        </div>
        `;

    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML =`
            <img
          src="${imageBaseURL}w154${poster_path}"
          alt="${title}"
          loading="lazy"
          draggable="false"
          class="img-cover"
        />
    `;
    banner.querySelector(".control-inner").appendChild(controlItem);
  }

  pageContent.appendChild(banner);

  addHeroSlide();
};
