let movieListArr = [];
let myWatchListArr = [];

const btnSearch = document.getElementById("btn-search");
const seachMovies = document.getElementById("seach-movies");
const movieListEl = document.getElementById("movie-list");
const movieForm = document.getElementById("movie-form");
const actionAdd = document.getElementById("action-add");
const laoderEl = document.getElementById("loader");
let responseFetch = "";

getLocalStorageMovie();

movieForm.addEventListener("submit", function (event) {
  event.preventDefault();
  getDetailMovieArr();
});

movieListEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("action-add")) {
    const getMovieToAdd = movieListArr.filter(
      (item) => item.imdbID === e.target.dataset.movieId
    );

    myWatchListArr.push(getMovieToAdd);
    localStorage.setItem("myWatchList", JSON.stringify(myWatchListArr));
    appendMovieHtml();
  } else if (e.target.classList.contains("action-remove")) {
    console.log(e.target.dataset.movieId);
    const indexOfElement = myWatchListArr.findIndex(
      (item) => item[0].imdbID === e.target.dataset.movieId
    );
    myWatchListArr.splice(indexOfElement, 1);
    localStorage.setItem("myWatchList", JSON.stringify(myWatchListArr));
    appendMovieHtml();
  }
});

function getLocalStorageMovie() {
  let myWathcListLocalStorage = JSON.parse(localStorage.getItem("myWatchList"));
  if (myWathcListLocalStorage) {
    myWatchListArr = myWathcListLocalStorage;
  }
}

async function getMovieSearch() {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=[YOUR_API_KEY]&type=movie&s=${seachMovies.value}`
  );
  const data = await response.json();

  return data;
}

async function getDetailMovieArr() {
  movieListArr = [];
  btnSearch.disabled = true;
  laoderEl.style.display = "block";
  const movieList = await getMovieSearch();
  responseFetch = movieList.Response;
  if (movieList.Response === "True") {
    const movieDetailPromises = movieList.Search.map(async (movieObj) => {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=[YOUR_API_KEY]&plot=short&i=${movieObj.imdbID}`
      );
      const data = await res.json();
      return data;
    });

    // Wait for all promises to resolve
    const movieDetails = await Promise.all(movieDetailPromises);

    // Now, all the movie details are available in the 'movieDetails' array
    movieListArr.push(...movieDetails);
  }
  appendMovieHtml();
  btnSearch.disabled = false;
  laoderEl.style.display = "none";
}

function appendMovieHtml() {
  let movieHtml = "";
  getLocalStorageMovie();
  if (responseFetch == "True") {
    movieListArr.map((movieObj) => {
      const inWatchList = myWatchListArr.some((obj) => {
        if (obj[0]) {
          return obj[0].imdbID === movieObj.imdbID;
        }
      });

      const actionHtml = inWatchList ? "action-remove" : "action-add";
      const actionIconHtml = inWatchList ? "fa-circle-minus" : "fa-circle-plus";

      movieHtml += `
      <div class="movie-container inner-movie-grid">
          <img
              class="movie-poster"
              alt="a poster featuring the movie"
              src="${movieObj.Poster}"/>
  
          <h2 class="movie-title">
            ${movieObj.Title}
            <i class="fa-solid fa-star movie-rating"></i> <span>${movieObj.imdbRating}</span>
          </h2>
  
          <div class="movie-info-col">
            <p class="movie-duration">${movieObj.Runtime}</p>
            <p class="movie-genre">${movieObj.Genre}</p>
            <p class="${actionHtml}" data-movie-id=${movieObj.imdbID}>
              <i class="fa-solid ${actionIconHtml} ${actionHtml}" data-movie-id=${movieObj.imdbID}></i>
              
            </p>
          </div>
          <p class="movie-description">
              ${movieObj.Plot}
          </p>
         
      </div>
      `;
    });
  } else {
    movieHtml += ` 
    <div class="message-placeholder">
      <p class="no-record">
        Unable to find what you’re looking for. Please try another search.
      </p>
    </div>`;
  }

  movieListEl.innerHTML = movieHtml;
}
