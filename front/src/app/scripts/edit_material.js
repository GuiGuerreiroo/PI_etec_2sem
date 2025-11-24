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

  // Removido o bind fixo; usaremos delegação de eventos para .editar
  // const editarButtons = document.querySelectorAll('.editar');
  // editarButtons.forEach(btn => {
  //   btn.addEventListener('click', (e) => {
  //     e.stopPropagation();
  //     alert('Função de edição em desenvolvimento.');
  //   });
  // });

  const addCard = document.querySelector('.add-card');
  if (addCard) {
    addCard.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
});
// ...existing code...

let currentEditingCard = null;

function openPopupForAdd() {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay) return;

  // Resetar campos
  const nome = document.getElementById('popupNome');
  const tam = document.getElementById('popupTamanho');
  const reu = document.getElementById('popupReutilizavel');
  const qtd = document.getElementById('popupQuantidade');

  if (nome) nome.value = '';
  if (tam) tam.value = '';
  if (reu) reu.value = 'sim';
  if (qtd) qtd.value = 1;

  // Ajustar título e botão
  const title = overlay.querySelector('.popup-title');
  if (title) title.textContent = 'Adicionar Material';

  const addBtn = document.getElementById('popupAdicionar');
  if (addBtn) {
    addBtn.textContent = 'Adicionar';
    addBtn.dataset.mode = 'add';
    delete addBtn.dataset.materialId;
  }

  currentEditingCard = null;
  overlay.style.display = 'flex';
}

function openPopupForEdit(card) {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay || !card) return;

  const nome = document.getElementById('popupNome');
  const tam = document.getElementById('popupTamanho');
  const reu = document.getElementById('popupReutilizavel');
  const qtd = document.getElementById('popupQuantidade');

  const data = card.dataset || {};

  if (nome) nome.value = data.name || (card.querySelector('h3')?.textContent || '').trim();
  if (tam) tam.value = data.size || '';
  if (qtd) qtd.value = data.quantity || card.querySelector('b')?.textContent || 1;

  if (reu) {
    // aceitar 'sim'/'nao'/'true'/'false'
    const raw = (data.reusable ?? 'sim').toString().toLowerCase();
    reu.value = raw === 'true' || raw === 'sim' ? 'sim' : 'nao';
  }

  const title = overlay.querySelector('.popup-title');
  if (title) title.textContent = 'Editar Material';

  const addBtn = document.getElementById('popupAdicionar');
  if (addBtn) {
    addBtn.textContent = 'Salvar';
    addBtn.dataset.mode = 'edit';
    addBtn.dataset.materialId = data.id || '';
  }

  currentEditingCard = card;
  overlay.style.display = 'flex';
}

async function loadMaterials() {
  const materials = await getAllMaterials();
  console.log(materials.material);

  const materialContainer = document.getElementById('materials-container');

  materials.materials.forEach((material) => {

    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-lg-4';

    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';

    // Guardar dados no dataset para facilitar o preenchimento do popup
    if (material.id) itemCard.dataset.id = material.id;
    if (material._id) itemCard.dataset.id = material._id;
    itemCard.dataset.name = material.name || '';
    itemCard.dataset.size = material.size || '';
    itemCard.dataset.quantity = material.totalQuantity ?? '';
    if (material.reusable !== undefined) {
      itemCard.dataset.reusable = String(material.reusable);
    }

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

// Abrir popup ao clicar no card de adicionar
document.addEventListener("click", (e) => {
  if (e.target.closest(".add-card")) {
    openPopupForAdd();
  }
});

// Delegação: abrir popup de edição ao clicar em "Editar"
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".editar");
  if (btn) {
    e.stopPropagation();
    const card = btn.closest(".item-card");
    openPopupForEdit(card);
  }
});

// Guardar e fechar (ADD/EDIT)
const popupAdicionarBtn = document.getElementById("popupAdicionar");
if (popupAdicionarBtn) {
  popupAdicionarBtn.addEventListener("click", () => {

    const nome = document.getElementById("popupNome")?.value || '';
    const reutilizavel = document.getElementById("popupReutilizavel")?.value || 'sim';
    const quantidade = document.getElementById("popupQuantidade")?.value || 1;
    const tamanho = document.getElementById("popupTamanho")?.value || '';

    const mode = popupAdicionarBtn.dataset.mode || 'add';

    if (mode === 'edit' && currentEditingCard) {
      // Atualiza o card na UI com os novos valores
      currentEditingCard.dataset.name = nome;
      currentEditingCard.dataset.size = tamanho;
      currentEditingCard.dataset.quantity = quantidade;
      currentEditingCard.dataset.reusable = reutilizavel;

      const title = currentEditingCard.querySelector('h3');
      if (title) title.textContent = `${nome} ${tamanho || ''}`;

      const qtyBold = currentEditingCard.querySelector('b');
      if (qtyBold) qtyBold.textContent = quantidade;

      console.log("Material atualizado:", { nome, reutilizavel, quantidade, tamanho });
      alert("Material atualizado!");
    } else {
      // Aqui ficaria sua lógica real de adicionar material (API)
      console.log("Novo Material:", nome, reutilizavel, quantidade, tamanho);
      alert("Material adicionado!");
    }

    document.getElementById("popupOverlay").style.display = "none";
  });
}

// Cancelar/fechar
const popupCancelarBtn = document.getElementById("popupCancelar");
if (popupCancelarBtn) {
  popupCancelarBtn.addEventListener("click", () => {
    document.getElementById("popupOverlay").style.display = "none";
  });
}

function fecharPopup() {
  document.querySelector('.popup-overlay').style.display = 'none';
}
function openPopupForAdd() {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay) return;

  const nome = document.getElementById('popupNome');
  const tam = document.getElementById('popupTamanho');
  const reu = document.getElementById('popupReutilizavel');
  const qtd = document.getElementById('popupQuantidade');

  if (nome) {
    nome.value = '';
    nome.disabled = false; // reabilita no modo adicionar
  }
  if (tam) {
    tam.value = '';
    tam.disabled = false; // reabilita no modo adicionar
  }
  if (reu) reu.value = 'sim';
  if (qtd) qtd.value = 1;

  const title = overlay.querySelector('.popup-title');
  if (title) title.textContent = 'Adicionar Material';

  const addBtn = document.getElementById('popupAdicionar');
  if (addBtn) {
    addBtn.textContent = 'Criar';
    addBtn.dataset.mode = 'add';
    delete addBtn.dataset.materialId;
  }

  currentEditingCard = null;
  overlay.style.display = 'flex';
}

function openPopupForEdit(card) {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay || !card) return;

  const nome = document.getElementById('popupNome');
  const tam = document.getElementById('popupTamanho');
  const reu = document.getElementById('popupReutilizavel');
  const qtd = document.getElementById('popupQuantidade');

  const data = card.dataset || {};

  if (nome) {
    nome.value = data.name || (card.querySelector('h3')?.textContent || '').trim();
    nome.disabled = true; // bloquear edição
  }
  if (tam) {
    tam.value = data.size || '';
    tam.disabled = true; // bloquear edição
  }
  if (qtd) qtd.value = data.quantity || card.querySelector('b')?.textContent || 1;

  if (reu) {
    const raw = (data.reusable ?? 'sim').toString().toLowerCase();
    reu.value = raw === 'true' || raw === 'sim' ? 'sim' : 'nao';
  }

  const title = overlay.querySelector('.popup-title');
  if (title) title.textContent = 'Editar Material';

  const addBtn = document.getElementById('popupAdicionar');
  if (addBtn) {
    addBtn.textContent = 'Salvar';
    addBtn.dataset.mode = 'edit';
    addBtn.dataset.materialId = data.id || '';
  }

  currentEditingCard = card;
  overlay.style.display = 'flex';
}