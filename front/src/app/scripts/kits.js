// const addCard = document.getElementById('addCard');
const modal = document.getElementById('novoKitModal');
// const closeModal = document.getElementById('closeModal');

addCard.addEventListener('click', (e) => {
  e.preventDefault();
  // remove foco visual do botao
  e.currentTarget.blur();
  // trava o scroll 
  document.body.style.overflow = 'hidden';
  // abre o modal apos o proximo frame
  requestAnimationFrame(() => {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('show');
  });
});
closeModal.addEventListener('click', () => {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
});
