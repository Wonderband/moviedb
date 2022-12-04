export function addToLocalStorage(id, target) {
  let array;
  let key;
  if (target.classList.contains('add-to-watched')) {
    key = 'watchedArray';
  } else {
    key = 'queueArray';
  }
  if (localStorage.getItem(key)) {
    array = JSON.parse(localStorage.getItem(key));
  } else {
    array = [];
  }
  if (~array.indexOf(id)) {
    array.splice(array.indexOf(id), 1);
    localStorage.setItem(key, JSON.stringify(array));
    return;
  } else {
    array.push(id);
    localStorage.setItem(key, JSON.stringify(array));
    return;
  }
}
