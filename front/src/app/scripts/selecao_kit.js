const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
  });
});

document.querySelector('.cancelar').addEventListener('click', () => {
  alert('Ação cancelada.');
});

document.querySelector('.concluir').addEventListener('click', () => {
  const selecionados = document.querySelectorAll('.card.selected').length;
  alert(selecionados > 0 ? `${selecionados} item(s) selecionado(s)!` : 'Nenhum item selecionado.');
});
