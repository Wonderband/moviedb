import createGallery from '../templates/movies-list.hbs';
import Notiflix from 'notiflix';
import notFoundImg from '../jpg/not-found-img.png';
import createPagination from './pagination';
import requestWithKey from './requestWithKey';

const moviesGallery = document.querySelector('.gallery');
const submitBtn = document.querySelector('.submit-button');
const searchForm = document.querySelector('.search-form');
const pgEl = document.querySelector('.tui-pagination');
const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list';
const TRENDING_URL = 'https://api.themoviedb.org/3/trending/movie/week';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

const preloader = document.querySelector('#search-loader');
const paginatorEl = document.querySelector('#paginator');
const paginationSection = document.querySelector('.paginator');

let paginationInstance;
let queryGlobal;

class MovieDB {
  showTrending() {
    return Promise.all([getGenres(GENRES_URL), getMovies(TRENDING_URL)])
      .then(res => {
        this.genresArray = res[0];
        return res[1].data;
      })
      .then(result => {
        return this.buildMoviesData(result);
      })
      .then(movies => {
        return showMovies(movies);
      })
      .then(res => {
        showPagination(TRENDING_URL, 1);
        queryGlobal = TRENDING_URL;
      })
      .catch(err => console.log(err));
  }

  buildMoviesData(data) {
    const movieData = data.results;
    this.totalMovies = data.total_results;
    return movieData.map(el => {
      return {
        // poster: el.poster_path ? IMG_URL + el.poster_path : notFoundImg,
        poster: el.poster_path,
        title: el.title,
        genres: el.genre_ids
          .map(genreId => this.genresArray.find(el => el.id === genreId).name)
          .slice(0, 3)
          .join(', '),
        date: el.release_date ? el.release_date.slice(0, 4) : 'XXXX',
        id: el.id,
      };
    });
  }
}

const myMoviesDB = new MovieDB();
myMoviesDB.showTrending();
submitBtn.addEventListener('click', findMovies);
window.onresize = onChangeWindowSize;

function showMovies(resultArray) {
  preloader.classList.add('visually-hidden');
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
  preloader.classList.remove('visually-hidden');
  let query = searchForm.elements.searchQuery.value.trim();
  if (!query) {
    Notiflix.Notify.failure('Empty search doesnt work! Back to trending!');
    clearMovies();
    clearPagination();
    myMoviesDB.showTrending();
    return;
  }
  let queryRequest = SEARCH_URL + '?query=' + query;
  getMovies(queryRequest)
    .then(res => {
      return myMoviesDB.buildMoviesData(res.data);
    })
    .then(movies => {
      clearMovies();
      if (!movies.length) {
        preloader.classList.add('visually-hidden');
        Notiflix.Notify.failure(
          'Search result not successful. Enter the correct movie name and try again'
        );
        clearPagination();
        myMoviesDB.showTrending();
        return;
      }
      showMovies(movies);
      showPagination(queryRequest, 1);
      queryGlobal = queryRequest;
    })
    .catch(err => console.log(err));
}

function getCurrentPageFromServer(request, currentPage) {
  const addPage = request.indexOf('?') === -1 ? '?page=' : '&page=';
  const queryRequest = request + addPage + currentPage;
  getMovies(queryRequest)
    .then(res => {
      return myMoviesDB.buildMoviesData(res.data);
    })
    .then(movies => {
      clearMovies();
      showMovies(movies);
    })
    .catch(err => console.log(err));
}

function clearPagination() {
  paginatorEl.innerHTML = '';
  paginatorEl.classList.add('visually-hidden');
  paginationSection.classList.add('visually-hidden');
}

function onChangeWindowSize() {
  if (paginationInstance) {
    if (
      (window.innerWidth < 768 &&
        paginationInstance._options.visiblePages === 7) ||
      (window.innerWidth >= 768 &&
        paginationInstance._options.visiblePages === 5)
    ) {
      const currentPage = paginationInstance._currentPage;
      clearPagination();
      showPagination(queryGlobal, currentPage);
    }
  }
}

function showPagination(query, page) {
  if (myMoviesDB.totalMovies > 20) {
    paginationInstance = createPagination(myMoviesDB.totalMovies);
    paginationInstance.movePageTo(page);
    paginatorEl.classList.remove('visually-hidden');
    paginationSection.classList.remove('visually-hidden');
    paginationInstance.on('afterMove', event => {
      const currentPage = event.page;
      getCurrentPageFromServer(query, currentPage);
      window.scrollBy(0, -10000);
    });
  } else clearPagination();
}
