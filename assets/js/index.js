"use strict";

/*
import all components and functions
*/

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
  heroBanner
);

const heroBanner = function ({ result: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = html`
    <button class="poster-box slider-item active">
      <img
        src="./assets/images/slider-control.jpg"
        alt="Slide to Puss in Boots: The Last Wish"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    </button>
    <button class="poster-box slider-item active">
      <img
        src="./assets/images/slider-control.jpg"
        alt="Slide to Puss in Boots: The Last Wish"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    </button>
    <button class="poster-box slider-item active">
      <img
        src="./assets/images/slider-control.jpg"
        alt="Slide to Puss in Boots: The Last Wish"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    </button>
    <button class="poster-box slider-item active">
      <img
        src="./assets/images/slider-control.jpg"
        alt="Slide to Puss in Boots: The Last Wish"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    </button>
    <button class="poster-box slider-item active">
      <img
        src="./assets/images/slider-control.jpg"
        alt="Slide to Puss in Boots: The Last Wish"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    </button>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      bacdrop_path,
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
  }
};
