# Movieapp

Movieapp is a simple movie discovery app built with HTML, CSS, jQuery, Axios, and the TMDB API. It lets users search for movies, view detailed movie information, and access a modern account page for login and registration.

## Features

- Search movies by title using the TMDB catalog
- View a rich movie detail page with poster, genres, rating, runtime, and production info
- Use a polished login/register experience on the account page
- Responsive layout designed for desktop and mobile

## Pages

- `index.html` - main movie search page
- `movie.html` - movie details page
- `registration.html` - account login and registration page

## Tech Stack

- HTML
- CSS
- JavaScript
- jQuery
- Axios
- TMDB API

## Run Locally

1. Open the project folder in VS Code or your editor of choice.
2. Serve the files with a local web server or Live Server extension.
3. Open `index.html` in the browser.
4. Search for a movie and open the detail view.

## Notes

- The movie search pages depend on the TMDB API key that is currently hardcoded in `js/main.js`.
- The registration page is styled and wired for the app layout, but it expects a matching backend API if you want the login and register forms to submit successfully.
