const footerBtn = document.querySelector('.footer__button');
const backdropNode = document.querySelector('.backdrop');
const modalNode = document.querySelector('.modal-container');
const modalContentNode = document.querySelector('.modal');

footerBtn.addEventListener('click', onFooterBtnClick);

function onFooterBtnClick(event) {
  console.log('hello');
  document.body.classList.add('noScroll');
  backdropNode.classList.remove('visually-hidden');
  modalNode.classList.remove('visually-hidden');

  document.addEventListener('keydown', onKeyDown);
  backdropNode.addEventListener('click', onBackdrop);
}
function onKeyDown(event) {
  if (event.key === 'Escape') {
    onCloseModal();
  }
}
function onBackdrop(event) {
  if (
    event.target.closest('.close-button') ||
    event.target.classList.contains('backdrop')
  ) {
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
}
