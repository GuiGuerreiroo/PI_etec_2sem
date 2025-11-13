document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.item-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
    });
  });

  const botaoCancelar = document.querySelector('.cancelar');
  const botaoConcluir = document.querySelector('.concluir');

  if (botaoCancelar) {
    botaoCancelar.addEventListener('click', () => {
      alert('Ação cancelada.');
    });
  }

  if (botaoConcluir) {
    botaoConcluir.addEventListener('click', () => {
      const selecionados = document.querySelectorAll('.item-card.selected').length;
      alert(selecionados > 0 ? `${selecionados} item(s) selecionado(s)!` : 'Nenhum item selecionado.');
    });
  }

  const editarButtons = document.querySelectorAll('.editar');
  editarButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('Função de edição em desenvolvimento.');
    });
  });

  const addCard = document.querySelector('.add-card');
  if (addCard) {
    addCard.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
});
