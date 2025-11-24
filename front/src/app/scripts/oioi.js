// Seleção dos cards
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
  });
});

// Botões de ação
document.querySelector('.cancelar').addEventListener('click', () => {
  alert('Ação cancelada.');
});

document.querySelector('.concluir').addEventListener('click', () => {
  const selecionados = document.querySelectorAll('.card.selected').length;
  alert(selecionados > 0 ? `${selecionados} item(s) selecionado(s)!` : 'Nenhum item selecionado.');
});

// Preenche comboboxes (1x até 20x) e define padrão "1x"
document.addEventListener('DOMContentLoaded', () => {
  const combos = document.querySelectorAll('.combo-quantidade');

  combos.forEach(combo => {
    for (let i = 1; i <= 20; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i}x`;
      combo.appendChild(option);
    }
    combo.value = "1"; // valor padrão
  });
});
