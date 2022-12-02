import createGallery from '../templates/lib-movie-li.hbs';
const pushMeBtn = document.querySelector('.test');
const galleryEl = document.querySelector('.gallery');

async function onPushMeBtnClick() {
  const array = JSON.parse(localStorage.getItem('watchedArray'));
  console.dir(array);
  const arrayOfPromises = array.map(async filmId => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${filmId}?api_key=0fd1ddf45233c721325ad47f082cd332` //&append_to_response=videos,images&language=en`
    );
    return response.json();
  });
  const films = await Promise.all(arrayOfPromises);
  console.dir(films);

  galleryEl.innerHTML = createGallery(films);
}

pushMeBtn.addEventListener('click', onPushMeBtnClick);
