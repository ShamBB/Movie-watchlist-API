let movieListArr = [];
let myWatchListArr = [];
let myWathcListLocalStorage = JSON.parse(localStorage.getItem("myWatchList"));
const movieWatchList = document.getElementById("movie-watchList");

if (myWathcListLocalStorage) {
  myWatchListArr = myWathcListLocalStorage;
}

appendWatchListHtml();

movieWatchList.addEventListener("click", (e) => {
  if (e.target.classList.contains("action-remove")) {
    const indexOfElement = myWatchListArr.findIndex(
      (item) => item[0].imdbID === e.target.dataset.movieId
    );
    myWatchListArr.splice(indexOfElement, 1);
    localStorage.setItem("myWatchList", JSON.stringify(myWatchListArr));
    appendWatchListHtml();
  }
});

function appendWatchListHtml() {
  let movieHtml = "";
  if (myWatchListArr.length > 0) {
    myWatchListArr.map((movieObj) => {
      movieObj = movieObj[0];
      console.log(movieObj);
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
            <p class="action-remove" data-movie-id=${movieObj.imdbID}>
              <i class="fa-solid fa-circle-minus action-remove" data-movie-id=${movieObj.imdbID}></i>
              
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
        Your watchlist is looking a little empty...
      </p>
      <a href="index.html" class="watchlist-add">
        <i class="fa-solid fa-circle-plus"></i>
        Let’s add some movies!
      </a>
    </div>`;
  }

  movieWatchList.innerHTML = movieHtml;
}
