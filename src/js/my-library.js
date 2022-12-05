import createGallery from '../templates/lib-movie-li.hbs';
import Handlebars from 'handlebars';
import placewHolder from '../jpg/placeholder.jpg';
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
    galleryEl.innerHTML = createGallery(filmsArray);
    preloader.classList.add('visually-hidden');
  } else {
    galleryEl.innerHTML = `<img class='placeholder' src="${placewHolder}" />`;
  }
}

filmsLoader(watchedBtn);

function currentBtnTogler(target) {
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
  filmsLoader(target);
}

watchedBtn.addEventListener('click', onLibraryBtnClick);
queueBtn.addEventListener('click', onLibraryBtnClick);
