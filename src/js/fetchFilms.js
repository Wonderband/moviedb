import createGallery from '../templates/movies-list.hbs';
import Notiflix from 'notiflix';
import notFoundImg from '../jpg/not-found-img.png';
import requestWithKey from './requestWithKey';

const moviesGallery = document.querySelector('.gallery');
const submitBtn = document.querySelector('.submit-button');
const searchForm = document.querySelector('.search-form');

const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list';
const TRENDING_URL = 'https://api.themoviedb.org/3/trending/movie/week';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

class MovieDB {
  showTrending() {
    Promise.all([getGenres(GENRES_URL), getMovies(TRENDING_URL)])
      .then(res => {
        this.genresArray = res[0];
        return res[1].data.results;
      })
      .then(result => {
        return this.buildMoviesData(result);
      })
      .then(movies => showMovies(movies))
      .catch(err => console.log(err));
  }

  buildMoviesData(data) {
    return data.map(el => {
      return {
        // relative path to image doesnt work on localhost?!
        poster: el.poster_path ? IMG_URL + el.poster_path : notFoundImg,
        title: el.title,
        genres: el.genre_ids
          .map(genreId => this.genresArray.find(el => el.id === genreId).name)
          .slice(0, 2),
        date: el.release_date.slice(0, 4),
        id: el.id,
      };
    });
  }
}

const myMoviesDB = new MovieDB();
myMoviesDB.showTrending();
submitBtn.addEventListener('click', findMovies);

function showMovies(resultArray) {
  moviesGallery.insertAdjacentHTML('beforeend', createGallery(resultArray));
}

function clearMovies() {
  moviesGallery.innerHTML = '';
}

async function getMovies(request) {
  try {
    const responce = await requestWithKey(request);
    return responce;
  } catch (err) {
    throw new Error(err);
  }
}

async function getGenres(request) {
  try {
    const responce = await requestWithKey(request);
    return responce.data.genres;
  } catch (err) {
    throw new Error(err);
  }
}

function findMovies(event) {
  event.preventDefault();
  const query = searchForm.elements.searchQuery.value.trim();
  if (!query) {
    Notiflix.Notify.failure('Empty search doesnt work! Back to trending!');
    clearMovies();
    myMoviesDB.showTrending();
    return;
  }
  const queryRequest = SEARCH_URL + '&query=' + query;
  getMovies(queryRequest)
    .then(res => {
      return myMoviesDB.buildMoviesData(res.data.results);
    })
    .then(movies => {
      clearMovies();
      if (!movies.length) {
        Notiflix.Notify.failure(
          'Search result not successful. Enter the correct movie name and try again'
        );
        return;
      }
      showMovies(movies);
    })
    .catch(err => console.log(err));
}
