document.addEventListener('DOMContentLoaded', () => {
  // const cards = document.querySelectorAll('.item-card');

  // cards.forEach(card => {
  //   card.addEventListener('click', () => {
  //     card.classList.toggle('selected');
  //   });
  // });

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

async function loadMaterials() {
  const materials = await getAllMaterials();
  console.log(materials.material);

  const materialContainer = document.getElementById('materials-container');

  materials.material.forEach((material) => {

    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-lg-4';

    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';

    const h3 = document.createElement('h3');
    h3.innerText = `${material.name} ${material.size || ''}`;

    const p = document.createElement('p');
    p.innerText = 'Quantidade: ';

    const b = document.createElement('b');
    b.innerText = material.totalQuantity;

    p.appendChild(b);

    const editButton = document.createElement('button');
    editButton.className = 'editar';
    editButton.innerText = 'Editar';

    itemCard.appendChild(h3);
    itemCard.appendChild(p);
    itemCard.appendChild(editButton);

    card.appendChild(itemCard);
    materialContainer.appendChild(card);
  });
  const plusCard = document.createElement('div');
  plusCard.className = 'col-12 col-sm-6 col-lg-4';
  const addCard = document.createElement('div');
  addCard.className = 'add-card';
  addCard.innerHTML = '<span>+</span>';
  plusCard.appendChild(addCard);
  materialContainer.appendChild(plusCard);
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".add-card")) {
    document.getElementById("popupOverlay").style.display = "flex";
  }
});

document.getElementById("popupCancelar").addEventListener("click", () => {
  document.getElementById("popupOverlay").style.display = "none";
});

document.getElementById("popupAdicionar").addEventListener("click", () => {

  const nome = document.getElementById("popupNome").value;
  const reutilizavel = document.getElementById("popupReutilizavel").value;
  const quantidade = document.getElementById("popupQuantidade").value;
  const unidade = document.getElementById("popupUnidade").value;

  console.log("Novo Material:", nome, reutilizavel, quantidade, unidade);

  alert("Material adicionado!");

  document.getElementById("popupOverlay").style.display = "none";
});

function fecharPopup() {
  document.querySelector('.popup-overlay').style.display = 'none';
}