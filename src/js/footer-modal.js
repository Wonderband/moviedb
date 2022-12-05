const backdropElm = document.querySelector('.backdrop');
const modalFooterElm = document.querySelector('.modal-footer');
const footerBtn = document.querySelector('.footer__button');

const modalContentNode = document.querySelector('.modal');

footerBtn.addEventListener('click', onFooterBtnClick);

function onFooterBtnClick(event) {
  document.body.classList.add('noScroll');
  backdropElm.classList.remove('visually-hidden');
  modalFooterElm.classList.remove('visually-hidden');

  document.addEventListener('keydown', onKeyDown);
  backdropElm.addEventListener('click', onBackdrop);
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
  backdropElm.classList.add('visually-hidden');
  modalFooterElm.classList.add('visually-hidden');

  document.removeEventListener('keydown', onKeyDown);
  backdropElm.removeEventListener('click', onBackdrop);
}
