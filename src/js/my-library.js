import createGallery from '../templates/lib-movie-li.hbs';
import Handlebars from 'handlebars';
const watchedBtn = document.querySelector('.watched');
const queueBtn = document.querySelector('.queue');
const galleryEl = document.querySelector('.gallery');
const preloader = document.querySelector('#lib-loader');

Handlebars.registerHelper('roundingData', data => {
  return data.slice(0, 4);
});

Handlebars.registerHelper('concatenateGenres', array => {
  return array
    .map(obj => {
      return obj.name;
    })
    .join(', ');
});
Handlebars.registerHelper('roundingRating', rating => {
  return rating.toFixed(1);
});

async function FilmsLoader(target) {
  preloader.classList.remove('visually-hidden');
  let key;
  if (target.classList.contains('watched')) {
    key = 'watchedArray';
  } else {
    key = 'queueArray';
  }
  const idArray = JSON.parse(localStorage.getItem(key));
  const arrayOfPromises = idArray.map(async filmId => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${filmId}?api_key=0fd1ddf45233c721325ad47f082cd332` //&append_to_response=videos,images&language=en`
    );
    return response.json();
  });
  const filmsArray = await Promise.all(arrayOfPromises);
  console.dir(filmsArray);
  preloader.classList.add('visually-hidden');
  galleryEl.innerHTML = createGallery(filmsArray);
}

FilmsLoader(watchedBtn);

function currentBtnTogler(target) {
  galleryEl.textContent = '';
  if (!target.classList.contains('current-button')) {
    const childrenObj = target.parentElement.children;
    for (const key in childrenObj) {
      if (Object.hasOwnProperty.call(childrenObj, key)) {
        if (childrenObj[key].classList.contains('current-button')) {
          childrenObj[key].classList.remove('current-button');
        } else {
          childrenObj[key].classList.add('current-button');
        }
      }
    }
  }
}

function onLibraryBtnClick(event) {
  const { target } = event;
  currentBtnTogler(target);
  FilmsLoader(target);
}

watchedBtn.addEventListener('click', onLibraryBtnClick);
queueBtn.addEventListener('click', onLibraryBtnClick);
