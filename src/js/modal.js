import axios from 'axios';
import createModal from '../templates/modal.hbs';

const modalNode = document.querySelector('.backdrop');

const API_KEY = '0fd1ddf45233c721325ad47f082cd332';
const MOVIE_URL = 'https://api.themoviedb.org/3/movie/';

function onOpenModal(event) {
  modalNode.classList.remove('.visually-hidden');
  const movieID = event.target.dataset.id;
  getMovie(MOVIE_URL + movieID);
}

async function getMovie(request) {
  try {
    const responce = await axios.get(request, { params: { api_key: API_KEY } });
    return responce;
  } catch (err) {
    throw new Error(err);
  }
}
