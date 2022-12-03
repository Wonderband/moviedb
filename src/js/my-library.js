import createGallery from '../templates/lib-movie-li.hbs';
const watchedBtn = document.querySelector('.watched');
const queueBtn = document.querySelector('.queue');
const galleryEl = document.querySelector('.gallery');

async function FilmsLoader(target) {
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
  galleryEl.innerHTML = createGallery(filmsArray);
}

FilmsLoader(watchedBtn);

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
  FilmsLoader(target);
}

watchedBtn.addEventListener('click', onLibraryBtnClick);
queueBtn.addEventListener('click', onLibraryBtnClick);
