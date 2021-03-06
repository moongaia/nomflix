const API_KEY = "1a21a3011e430600c006ad0e00b444da";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IGenres {
  id: number;
  name: string;
}

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  popularity: number;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: IGenres[];
  name: string;
}

interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// Movies
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&page=2`).then(
    (response) => response.json()
  );
}

export function getTopRated() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcoming() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&page=4`).then(
    (response) => response.json()
  );
}

// Tv Shows
export function getTvOntheAir() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&page=2`).then(
    (response) => response.json()
  );
}

export function getAiringToday() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&page=4`).then(
    (response) => response.json()
  );
}

export function getPopular() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&page=2`).then(
    (response) => response.json()
  );
}

export function getTvTopRated() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&page=3`).then(
    (response) => response.json()
  );
}

// Search
export function searchMovies(query: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${query}`
  ).then((response) => response.json());
}

export function searchTvShows(query: string) {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${query}`).then(
    (response) => response.json()
  );
}

// Detail

export function getMovieDetail(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTvDetail(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
