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

document.addEventListener('DOMContentLoaded', () => {
  const combos = document.querySelectorAll('.combo-quantidade');

  combos.forEach(combo => {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Qtd';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    combo.appendChild(defaultOption);

    const size = parseInt(document.getElementById('b500').textContent);

    for (let i = 1; i <= size; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i}x`;
      combo.appendChild(option);
    }
  });
});
