const addToWatchedBtn = document.querySelector('.add-to-watched');

function addToLocalStorage(id) {
  if (localStorage.getItem('watchedArray')) {
    const array = JSON.parse(localStorage.getItem('watchedArray'));
    console.dir(array);
    if (array.includes(id)) {
      console.log('Фильм уже добавлен!');
      return;
    }
    array.push(id);
    localStorage.setItem('watchedArray', JSON.stringify(array));
    return;
  }
  const array = [];
  array.push(id);
  localStorage.setItem('watchedArray', JSON.stringify(array));
}

function onAddToWatchedBtnClick(event) {
  event.preventDefault();
  const link = document.querySelector('.modal__link');
  const filmId = link.dataset.id;
  console.dir(filmId);
  addToLocalStorage(filmId);
}

addToWatchedBtn.addEventListener('click', onAddToWatchedBtnClick);
