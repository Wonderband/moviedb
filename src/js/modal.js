import requestWithKey from './requestWithKey';
import createModal from '../templates/modal.hbs';
import notFoundImg from '../jpg/not-found-img.png';

const modalNode = document.querySelector('.modal');
const testButton = document.querySelector('.test-button');
const moviesGallery = document.querySelector('.gallery');
const movieNode = document.querySelector('.movie');

const addToWathched = document.createElement('button');
addToWathched.textContent = 'ADD TO WATCHED';
const addToQueue = document.createElement('button');
addToQueue.textContent = 'ADD TO QUEUE';

const MOVIE_URL = 'https://api.themoviedb.org/3/movie/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

testButton.addEventListener('click', onOpenModal);
moviesGallery.addEventListener(
  'click',
  event => {
    event.preventDefault();
    // console.dir(event.target);
    if (event.target.className == 'movie') console.dir(event.target);
  },
  true
);

function onOpenModal(event) {
  event.preventDefault();
  // if (event.target.tagName == 'DIV')
  modalNode.classList.remove('.visually-hidden');
  // const movieID = event.target.dataset.id;
  const movieID = 436270;
  getMovie(MOVIE_URL + movieID)
    .then(data => {
      const movieObj = { ...data };
      movieObj.poster = data.poster_path
        ? IMG_URL + data.poster_path
        : notFoundImg;
      movieObj.genres = data.genres.map(el => el.name).join(', ');
      movieObj.about =
        data.overview ?? 'Sorry, there is no information about this movie';
      const markup = createModal(movieObj);
      insertIntoModal(markup);
    })
    .catch(err => console.log(err));
}

function onCloseModal(event) {
  //removeEventListener
  //clear modal content
}

function insertIntoModal(movieData) {
  modalNode.insertAdjacentHTML('beforeend', movieData);
  modalNode.append(addToWathched, addToQueue);
}

// document.addEventListener('keydown', function(event){
// 	if(event.key === "Escape"){
// 		//do something
// 	}
// });

async function getMovie(request) {
  try {
    const responce = await requestWithKey(request);
    return responce.data;
  } catch (err) {
    throw new Error(err);
  }
}
