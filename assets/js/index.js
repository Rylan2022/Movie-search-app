"use strict";

/*
import all components and functions
*/

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

const pageContent = document.querySelector("[page-content]");

// Initialize the sidebar
sidebar();

/**
 * Home page sections (Top rated, Upcoming, Trending movies)
 */

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming",
  },
  {
    title: "This Weekly Trending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated",
  },
];

/**
 * Fetch all genres, e.g., [ { "id": "123", "name": "Action"}]
 * Then change genre format, e.g., {123: "Action"}
 */
const genreList = {
  // Create genre string from genre_id, e.g., [23, 43] -> "Action, Romance"
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      if (this[genreId]) newGenreList.push(this[genreId]);
    }

    return newGenreList.join(", ");
  },
};

// Fetch genres from server and populate genreList object
fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  function (response) {
    const { genres } = response;
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    // Fetch popular movies for the hero banner
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
      heroBanner
    );
  }
);

// Function to create the hero banner
const heroBanner = function (response) {
  console.log("Response received by heroBanner:", response); // Debugging line

  // Ensure response.results exists and is an array
  if (!response || !Array.isArray(response.results)) {
    console.error("Invalid data format: 'results' is not an array", response);
    return; // Exit the function if data is invalid
  }

  const movieList = response.results;

  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.setAttribute("aria-label", "Popular Movies");

  banner.innerHTML = `
      <div class="banner-slider"></div>
      <div class="slider-control">
        <div class="control-inner"></div>
      </div>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");

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
            <div class="meta-item">${release_date.split("-")[0]}</div>
            <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
          </div>
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
    `;

    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
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
  addHeroSlide(); // Call the function to add the slider functionality

  /**
   * Fetch data for home page sections (Top rated, Upcoming, Trending movies)
   */
  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
      createMovieList,
      title
    );
  }
};

/**
 * Hero slider functionality
 */
const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll(".slider-item");
  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
  };

  sliderControls.forEach((control) =>
    control.addEventListener("click", sliderStart)
  );
};

// Function to create a list of movies for each section
const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.setAttribute("aria-label", `${title}`);

  movieListElem.innerHTML = `
      <div class="title-wrapper">
        <h3 class="title-large">${title}</h3>
      </div>

      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
      `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); // called from movie_card.js

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};
