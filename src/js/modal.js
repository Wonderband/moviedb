import requestWithKey from './requestWithKey';
import createModal from '../templates/modal.hbs';
import notFoundImg from '../jpg/not-found-img.png';
import { addToLocalStorage } from './localStorageAPI';
import createGallery from '../templates/lib-movie-li.hbs';
import placewHolder from '../jpg/placeholder.jpg';

const watchedBtn = document.querySelector('.watched');
const queueBtn = document.querySelector('.queue');
const backdropNode = document.querySelector('.backdrop');
const modalNode = document.querySelector('.modal-container');
const modalContentNode = document.querySelector('.modal');
const moviesGallery = document.querySelector('.gallery');
const preloader = document.querySelector('#modal-loader');

const MOVIE_URL = 'https://api.themoviedb.org/3/movie/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

moviesGallery.addEventListener('click', event => {
  if (event.target.closest('.gallery-item')) {
    onOpenModal(event);
  }
});

function onOpenModal(event) {
  event.preventDefault();
  document.body.classList.add('noScroll');
  backdropNode.classList.remove('visually-hidden');
  preloader.classList.remove('visually-hidden');
  const movieID = event.target.closest('.gallery-item').dataset.id;
  getMovie(MOVIE_URL + movieID)
    .then(data => {
      const movieObj = { ...data };
      movieObj.vote_average = data.vote_average.toFixed(1);
      movieObj.popularity = data.popularity.toFixed(1);
      //   movieObj.poster = data.poster_path
      //     ? IMG_URL + data.poster_path
      //     : notFoundImg;
      movieObj.poster = data.poster_path;
      movieObj.genres = data.genres.map(el => el.name).join(', ');
      movieObj.about =
        data.overview ?? 'Sorry, there is no information about this movie';

      preloader.classList.add('visually-hidden');
      modalNode.classList.remove('visually-hidden');
      insertIntoModal(createModal(movieObj));
      const addToWatchedBtn = document.querySelector('.add-to-watched');
      addToWatchedBtn.addEventListener('click', onModalBtnClick);
      const addToQueueBtn = document.querySelector('.add-to-queue');
      addToQueueBtn.addEventListener('click', onModalBtnClick);
      btnStyleChecker(addToWatchedBtn, addToQueueBtn);
    })
    .catch(err => console.log(err));

  document.addEventListener('keydown', onKeyDown);
  backdropNode.addEventListener('click', onBackdrop);
}

function onBackdrop(event) {
  if (
    event.target.closest('.close-button') ||
    event.target.classList.contains('backdrop')
  ) {
    onCloseModal();
  }
}

function onKeyDown(event) {
  if (event.key === 'Escape') {
    onCloseModal();
  }
}

function onCloseModal() {
  document.body.classList.remove('noScroll');
  backdropNode.classList.add('visually-hidden');
  modalNode.classList.add('visually-hidden');
  modalContentNode.textContent = '';

  document.removeEventListener('keydown', onKeyDown);
  backdropNode.removeEventListener('click', onBackdrop);
  if (watchedBtn) {
    if (watchedBtn.classList.contains('current-button')) {
      filmsLoader(watchedBtn);
    } else {
      filmsLoader(queueBtn);
    }
  }
}

async function filmsLoader(target) {
  let key;
  if (target.classList.contains('watched')) {
    key = 'watchedArray';
  } else {
    key = 'queueArray';
  }
  const idArray = JSON.parse(localStorage.getItem(key));
  if (idArray && idArray.length > 0) {
    preloader.classList.remove('visually-hidden');

    const arrayOfPromises = idArray.map(async filmId => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${filmId}?api_key=0fd1ddf45233c721325ad47f082cd332` //&append_to_response=videos,images&language=en`
      );
      return response.json();
    });
    const filmsArray = await Promise.all(arrayOfPromises);
    moviesGallery.innerHTML = createGallery(filmsArray);
    preloader.classList.add('visually-hidden');
  } else {
    moviesGallery.innerHTML = `<img class='placeholder' src="${placewHolder}" />`;
  }
}

function insertIntoModal(movieData) {
  modalContentNode.insertAdjacentHTML('beforeend', movieData);
}

async function getMovie(request) {
  try {
    const responce = await requestWithKey(request);
    return responce.data;
  } catch (err) {
    throw new Error(err);
  }
}

function onModalBtnClick(event) {
  const { target } = event;
  const filmId = target.dataset.id;
  addToLocalStorage(filmId, target);
  target.classList.toggle('button-highlighted');
  if (target.classList.contains('add-to-watched')) {
    if (target.classList.contains('button-highlighted')) {
      target.innerText = 'REMOVE FROM WATCHED';
    } else {
      target.innerText = 'ADD TO WATCHED';
    }
  } else {
    if (target.classList.contains('button-highlighted')) {
      target.innerText = 'REMOVE FROM QUEUE';
    } else {
      target.innerText = 'ADD TO QUEUE';
    }
  }
}

function btnStyleChecker(btn1, btn2) {
  if (localStorage.getItem('watchedArray')) {
    const array = JSON.parse(localStorage.getItem('watchedArray'));
    if (array.includes(btn1.dataset.id)) {
      btn1.classList.add('button-highlighted');
      btn1.innerText = 'REMOVE FROM WATCHED';
    }
  }
  if (localStorage.getItem('queueArray')) {
    const array = JSON.parse(localStorage.getItem('queueArray'));
    if (array.includes(btn2.dataset.id)) {
      btn2.classList.add('button-highlighted');
      btn2.innerText = 'REMOVE FROM QUEUE';
    }
  }
}
