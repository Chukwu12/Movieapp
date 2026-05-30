const TMDB_API_KEY = "98325a9d3ed3ec225e41ccc4d360c817";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function posterUrl(path, size = "w500") {
  return path
    ? `${TMDB_IMAGE_BASE}/${size}${path}`
    : "https://placehold.co/500x750/111827/e5eefc?text=No+Poster";
}

function formatList(items, fallback = "Unavailable") {
  if (!Array.isArray(items) || items.length === 0) {
    return fallback;
  }

  return items.join(", ");
}

function setResultsState(message) {
  $("#resultsMeta").text(message);
}

$(document).ready(() => {
  $("#searchForm").on("submit", (e) => {
    e.preventDefault();

    const searchText = $("#searchText").val().trim();

    if (!searchText) {
      setResultsState("Enter a title to search the catalog.");
      $("#movies").html(
        '<div class="movie-card__empty">Search for a movie to see matching results.</div>'
      );
      return;
    }

    getMovies(searchText);
  });
});

function getMovies(searchText) {
  setResultsState(`Searching for "${searchText}"...`);
  $("#movies").html(
    '<div class="movie-card__empty">Loading results...</div>'
  );

  axios
    .get(
      "https://api.themoviedb.org/3/search/movie?api_key=" +
        TMDB_API_KEY +
        "&language=en-US&query=" +
        encodeURIComponent(searchText)
    )
    .then(function (response) {
      const movies = response.data.results || [];

      if (!movies.length) {
        setResultsState(`No matches found for "${searchText}".`);
        $("#movies").html(
          '<div class="movie-card__empty">No results matched that search. Try a different title.</div>'
        );
        return;
      }

      const output = movies
        .map((movie) => {
          const title = escapeHtml(movie.title || "Untitled movie");
          const releaseYear = movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "Unknown year";
          const overview = escapeHtml(
            movie.overview || "No description is available for this title."
          );

          return `
            <article class="movie-card">
              <img
                class="movie-card__poster"
                src="${posterUrl(movie.poster_path)}"
                alt="${title} poster"
              />
              <div class="movie-card__body">
                <h3 class="movie-card__title">${title}</h3>
                <p class="movie-card__meta">${releaseYear}</p>
                <p class="movie-card__meta">${overview}</p>
                <a onclick="movieSelected('${movie.id}')" class="movie-card__button" href="#">Movie Details</a>
              </div>
            </article>
          `;
        })
        .join("");

      setResultsState(`${movies.length} result${movies.length === 1 ? "" : "s"} found.`);
      $("#movies").html(output);
    })
    .catch(function (error) {
      console.log(error);
      setResultsState("Could not load results right now.");
      $("#movies").html(
        '<div class="movie-card__error">Something went wrong while loading movies.</div>'
      );
    });
}

function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.location = "movie.html";
  return false;
}

function getMovie() {
  const movieId = sessionStorage.getItem("movieId");

  if (!movieId) {
    $("#movie").html(
      '<div class="movie-card__empty">No movie selected. Go back and choose a title.</div>'
    );
    return;
  }

  axios
    .get(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "?api_key=" +
        TMDB_API_KEY
    )
    .then(function (response) {
      const movie = response.data;
      const title = escapeHtml(movie.title || "Untitled movie");
      const overview = escapeHtml(
        movie.overview || "No plot summary is available for this movie."
      );
      const genres = formatList(
        (movie.genres || []).map((genre) => genre.name),
        "Unspecified"
      );
      const releaseDate = movie.release_date || "Unknown";
      const rating =
        typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "N/A";
      const runtime = movie.runtime ? `${movie.runtime} min` : "Unavailable";
      const companies = formatList(
        (movie.production_companies || []).map((company) => company.name),
        "Unavailable"
      );
      const imdbLink = movie.imdb_id
        ? `<a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" rel="noreferrer" class="btn btn-primary">View IMDB</a>`
        : "";

      const output = `
        <div class="movie-hero">
          <div class="movie-poster">
            <img src="${posterUrl(movie.poster_path, "w780")}" alt="${title} poster">
          </div>
          <div class="movie-copy">
            <p class="eyebrow">Movie details</p>
            <h1>${title}</h1>
            <div class="movie-badges">
              <span class="movie-badge">${rating}/10 rating</span>
              <span class="movie-badge">${releaseDate}</span>
              <span class="movie-badge">${runtime}</span>
            </div>
            <p class="movie-overview">${overview}</p>
            <dl class="movie-meta-list">
              <div class="movie-meta-item">
                <dt>Genre</dt>
                <dd>${escapeHtml(genres)}</dd>
              </div>
              <div class="movie-meta-item">
                <dt>Released</dt>
                <dd>${escapeHtml(releaseDate)}</dd>
              </div>
              <div class="movie-meta-item">
                <dt>Rating</dt>
                <dd>${escapeHtml(rating)}</dd>
              </div>
              <div class="movie-meta-item">
                <dt>Runtime</dt>
                <dd>${escapeHtml(runtime)}</dd>
              </div>
              <div class="movie-meta-item">
                <dt>Production</dt>
                <dd>${escapeHtml(companies)}</dd>
              </div>
            </dl>
            <div class="movie-actions">
              ${imdbLink}
              <a href="index.html" class="btn btn-default">Go Back To Search</a>
            </div>
          </div>
        </div>
      `;

      $("#movie").html(output);
    })
    .catch(function (error) {
      console.log(error);
      $("#movie").html(
        '<div class="movie-card__error">Unable to load the selected movie right now.</div>'
      );
    });
}
