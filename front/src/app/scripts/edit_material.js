function parseReusable(value) {
  return value === 'sim' ? true : false;
}

function reusableToSelectValue(value) {
    return value === true ? 'Sim' : 'Não';
}

function toInt(value, fallback = 1) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

let currentEditingCard = null;

document.addEventListener('DOMContentLoaded', () => {
  // Botões genéricos
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

  const addCard = document.querySelector('.add-card');
  if (addCard) {
    addCard.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Delegação: abrir popup ao clicar no card de adicionar
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

  // Salvar (ADD/EDIT) - integra com createMaterial/updateMaterial
  const popupAdicionarBtn = document.getElementById("popupAdicionar");
  if (popupAdicionarBtn) {
    popupAdicionarBtn.addEventListener("click", async () => {
      const name = document.getElementById("popupNome")?.value?.trim() || '';
      const reusableItem = document.getElementById("popupReutilizavel")?.value || 'sim';
      const totalQuantityItem = document.getElementById("popupQuantidade")?.value;
      const size = document.getElementById("popupTamanho")?.value || '';

      const reusable = parseReusable(reusableItem);
      const totalQuantity = toInt(totalQuantityItem, 1);

      const isEdit = popupAdicionarBtn.dataset.mode === 'edit';

      // Validação para modo adicionar
      if (!isEdit && !name) {
        alert("Por favor, preencha o nome do material.");
        return;
      }

      popupAdicionarBtn.disabled = true;
      popupAdicionarBtn.textContent = isEdit ? 'Salvando...' : 'Criando...';

      try {
        if (isEdit && currentEditingCard) {
          const materialId = popupAdicionarBtn.dataset.materialId;
          if (!materialId) {
            throw new Error('ID do material não encontrado.');
          }
          console.log(reusable)
          console.log(reusableItem)
          // Chamada para updateMaterial com os parâmetros corretos
          await updateMaterial(materialId, { reusable, totalQuantity });

          // Atualiza o card na interface
          currentEditingCard.dataset.reusable = String(reusable);
          currentEditingCard.dataset.quantity = String(totalQuantity);

          const qtyBold = currentEditingCard.querySelector('b');
          if (qtyBold) qtyBold.textContent = totalQuantity;

          alert("Material atualizado com sucesso!");
          loadMaterials()
        } else {
          // Chamada para createMaterial com os parâmetros corretos
          await createMaterial(name, reusable, totalQuantity);
          alert("Material adicionado com sucesso!");
          await loadMaterials();
        }

        closePopup();
      } catch (err) {
        console.error(err);
        alert("Ocorreusable um erro. Verifique os dados e tente novamente.");
      } finally {
        popupAdicionarBtn.disabled = false;
        popupAdicionarBtn.textContent = isEdit ? 'Salvar' : 'Adicionar';
      }
    });
  }

  // Cancelar/fechar
  const popupCancelarBtn = document.getElementById("popupCancelar");
  if (popupCancelarBtn) {
    popupCancelarBtn.addEventListener("click", () => {
      closePopup();
    });
  }

  // Fechar ao clicar no X
  const closeBtn = document.querySelector(".close-popup");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closePopup();
    });
  }

  // Carrega materiais ao iniciar
//   loadMaterials();
});

// Abre popup no modo "Adicionar"
function openPopupForAdd() {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay) return;

  const name = document.getElementById('popupNome');
  const size = document.getElementById('popupTamanho');
  const reusable = document.getElementById('popupReutilizavel');
  const totalQuantity = document.getElementById('popupQuantidade');

  // Limpa os campos
  if (name) {
    name.value = '';
    name.disabled = false;
  }
  if (size) {
    size.value = '';
    size.disabled = false;
    size.style.display = 'block';
  }
  if (totalQuantity) totalQuantity.value = 1;
  if (reusable) reusable.value = 'sim';

  const title = overlay.querySelector('.popup-title');
  if (title) title.textContent = 'Adicionar Material';

  // Atualiza os labels usando IDs - modo adicionar
  const labelNome = document.getElementById('labelNome');
  const labelTamanho = document.getElementById('labelTamanho');
  const labelReutilizavel = document.getElementById('labelReutilizavel');
  const labelQuantidade = document.getElementById('labelQuantidade');

  if (labelNome) {
    labelNome.innerHTML = 'Nome: <span class="required-text">*</span>';
    labelNome.style.display = 'block';
  }
  if (labelTamanho) {
    labelTamanho.innerHTML = 'Tamanho: <span class="optional-text">(Opcional)</span>';
    labelTamanho.style.display = 'block';
  }
  if (labelReutilizavel) {
    labelReutilizavel.innerHTML = 'Reutilizável: <span class="required-text">*</span>';
    labelReutilizavel.style.display = 'block';
  }
  if (labelQuantidade) {
    labelQuantidade.innerHTML = 'Quantidade: <span class="required-text">*</span>';
    labelQuantidade.style.display = 'block';
  }

  const addBtn = document.getElementById('popupAdicionar');
  if (addBtn) {
    addBtn.textContent = 'Adicionar';
    addBtn.dataset.mode = 'add';
    delete addBtn.dataset.materialId;
  }

  currentEditingCard = null;
  overlay.style.display = 'flex';
}

// Abre popup no modo "Editar"
function openPopupForEdit(card) {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay || !card) return;

  const name = document.getElementById('popupNome');
  const size = document.getElementById('popupTamanho');
  const reusable = document.getElementById('popupReutilizavel');
  const totalQuantity = document.getElementById('popupQuantidade');

  const data = card.dataset || {};
  const id = data.id;
  
  if (!id) {
    console.warn('Card sem data-id, abortando edição.');
    return;
  }

  // Preenche os campos com os dados atuais
  if (name) {
    name.value = data.name || (card.querySelector('h3')?.textContent || '').trim();
    name.disabled = true;
  }
  if (size) {
    size.style.display = 'none';
  }
  if (totalQuantity) {
    const q = data.quantity || card.querySelector('b')?.textContent || 1;
    totalQuantity.value = toInt(q, 1);
  }
  if (reusable) {
    reusable.value = reusableToSelectValue(data.reusable ?? 'sim');
  }

  const title = overlay.querySelector('.popup-title');
  if (title) title.textContent = 'Editar Material';

  // Atualiza os labels para modo edição usando IDs - sem asteriscos, sem campo tamanho
  const labelNome = document.getElementById('labelNome');
  const labelTamanho = document.getElementById('labelTamanho');
  const labelReutilizavel = document.getElementById('labelReutilizavel');
  const labelQuantidade = document.getElementById('labelQuantidade');

  if (labelNome) {
    labelNome.innerHTML = 'Nome:';
    labelNome.style.display = 'block';
  }
  if (labelTamanho) {
    labelTamanho.style.display = 'none';
  }
  if (labelReutilizavel) {
    labelReutilizavel.innerHTML = 'Reutilizável: <span class="optional-text">(Opcional)</span>';
    labelReutilizavel.style.display = 'block';
  }
  if (labelQuantidade) {
    labelQuantidade.innerHTML = 'Quantidade: <span class="optional-text">(Opcional)</span>';
    labelQuantidade.style.display = 'block';
  }

  const addBtn = document.getElementById('popupAdicionar');
  if (addBtn) {
    addBtn.textContent = 'Salvar';
    addBtn.dataset.mode = 'edit';
    addBtn.dataset.materialId = id;
  }

  currentEditingCard = card;
  overlay.style.display = 'flex';
}

function closePopup() {
  const overlay = document.getElementById('popupOverlay');
  if (overlay) overlay.style.display = 'none';
  
  // Limpa os campos ao fechar
  const name = document.getElementById('popupNome');
  const size = document.getElementById('popupTamanho');
  const totalQuantity = document.getElementById('popupQuantidade');
  const reusable = document.getElementById('popupReutilizavel');
  
  if (name) name.value = '';
  if (size) size.value = '';
  if (totalQuantity) totalQuantity.value = 1;
  if (reusable) reusable.value = 'sim';
  
  currentEditingCard = null;
}

// Função auxiliar para fechar popup (chamada do HTML)
function fecharPopup() {
  closePopup();
}

// Carregar materiais e montar cards
async function loadMaterials() {
  const materialContainer = document.getElementById('materials-container');
  if (!materialContainer) return;

  // Limpa antes de renderizar
  materialContainer.innerHTML = '';

  try {
    const materials = await getAllMaterials();
    const lista = materials?.materials || [];

    lista.forEach((material) => {
      const card = document.createElement('div');
      card.className = 'col-12 col-sm-6 col-lg-4';

      const itemCard = document.createElement('div');
      itemCard.className = 'item-card';

      // dataset para facilitar o preenchimento do popup
      const id = material.id || material._id || '';
      if (id) itemCard.dataset.id = id;
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

      const p2 = document.createElement('p');
      console.log(material.reusable);
      p2.innerText = `Reutilizável: ${material.reusable ? 'Sim' : 'Não'}`;
      
      const editButton = document.createElement('button');
      editButton.className = 'editar';
      editButton.innerText = 'Editar';
      
      itemCard.appendChild(h3);
      itemCard.appendChild(p);
      itemCard.appendChild(p2);
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
  } catch (err) {
    console.error('Erro ao carregar materiais:', err);
  }
}