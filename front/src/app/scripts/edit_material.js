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

function setupToastContainer() {
  if (!document.getElementById('toastContainer')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }
}

function showToast(message, type = 'success') {
  const toastId = 'toast-' + Date.now();
  const bgColor = type === 'success' ? 'bg-success' :
    type === 'error' ? 'bg-danger' :
      type === 'warning' ? 'bg-warning' : 'bg-info';

  const icon = type === 'success' ? 'fa-check-circle' :
    type === 'error' ? 'fa-exclamation-circle' :
      type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgColor} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas ${icon} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  const container = document.getElementById('toastContainer');
  container.insertAdjacentHTML('beforeend', toastHTML);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 4000
  });

  toast.show();

  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupToastContainer();

  const popupAdicionarBtn = document.getElementById("popupAdicionar");
  if (popupAdicionarBtn) {
    popupAdicionarBtn.addEventListener("click", async () => {
      const name = document.getElementById("popupNome")?.value?.trim() || '';
      const reusableItem = document.getElementById("popupReutilizavel")?.value || 'sim';
      const totalQuantityItem = document.getElementById("popupQuantidade")?.value;
      const size = document.getElementById("popupTamanho")?.value?.trim() || '';

      const reusable = parseReusable(reusableItem);
      const totalQuantity = toInt(totalQuantityItem, 1);

      const isEdit = popupAdicionarBtn.dataset.mode === 'edit';
      if (!isEdit && !name) {
        showToast("Por favor, preencha o nome do material.", "error");
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
          await updateMaterial(materialId, { reusable, totalQuantity });

          currentEditingCard.dataset.reusable = String(reusable);
          currentEditingCard.dataset.quantity = String(totalQuantity);

          const qtyBold = currentEditingCard.querySelector('b');
          if (qtyBold) qtyBold.textContent = totalQuantity;

          showToast("Material atualizado com sucesso!", "success");
          loadMaterials()
        } else {
          await createMaterial(name, reusable, totalQuantity, size);
          showToast("Material adicionado com sucesso!", "success");
          await loadMaterials();
        }

        closePopup();
      } catch (err) {
        console.error(err);
        showToast("Ocorreu um erro. Verifique os dados e tente novamente.", "error");
      } finally {
        popupAdicionarBtn.disabled = false;
        popupAdicionarBtn.textContent = isEdit ? 'Salvar' : 'Adicionar';
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const botaoCancelar = document.querySelector('.cancelar');
  const botaoConcluir = document.querySelector('.concluir');

  const addCard = document.querySelector('.add-card');
  if (addCard) {
    addCard.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest(".add-card")) {
      openPopupForAdd();
    }
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".editar");
    if (btn) {
      e.stopPropagation();
      const card = btn.closest(".item-card");
      openPopupForEdit(card);
    }
  });

  const popupAdicionarBtn = document.getElementById("popupAdicionar");
  if (popupAdicionarBtn) {
    popupAdicionarBtn.addEventListener("click", async () => {
      const name = document.getElementById("popupNome")?.value?.trim() || '';
      const reusableItem = document.getElementById("popupReutilizavel")?.value || 'sim';
      const totalQuantityItem = document.getElementById("popupQuantidade")?.value;
      const size = document.getElementById("popupTamanho")?.value?.trim() || '';

      const reusable = parseReusable(reusableItem);
      const totalQuantity = toInt(totalQuantityItem, 1);

      const isEdit = popupAdicionarBtn.dataset.mode === 'edit';

      if (!isEdit && !name) {
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
 
          await updateMaterial(materialId, { reusable, totalQuantity });
          currentEditingCard.dataset.reusable = String(reusable);
          currentEditingCard.dataset.quantity = String(totalQuantity);

          const qtyBold = currentEditingCard.querySelector('b');
          if (qtyBold) qtyBold.textContent = totalQuantity;

        }

        closePopup();
      } catch (err) {
        console.error(err);
      } finally {
        popupAdicionarBtn.disabled = false;
        popupAdicionarBtn.textContent = isEdit ? 'Salvar' : 'Adicionar';
      }
    });
  }

  const popupCancelarBtn = document.getElementById("popupCancelar");
  if (popupCancelarBtn) {
    popupCancelarBtn.addEventListener("click", () => {
      closePopup();
    });
  }

  const closeBtn = document.querySelector(".close-popup");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closePopup();
    });
  }
});

function openPopupForAdd() {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay) return;

  const name = document.getElementById('popupNome');
  const size = document.getElementById('popupTamanho');
  const reusable = document.getElementById('popupReutilizavel');
  const totalQuantity = document.getElementById('popupQuantidade');

  if (name) {
    name.value = '';
    name.disabled = false;
  }
  if (size) {
    size.value = '';
    size.disabled = false;
  }
  if (totalQuantity) totalQuantity.value = 1;
  if (reusable) reusable.value = 'sim';

  const title = overlay.querySelector('.popup-title');
  if (title) title.textContent = 'Adicionar Material';

  const labelNome = document.getElementById('labelNome');
  const labelTamanho = document.getElementById('labelTamanho');
  const labelReutilizavel = document.getElementById('labelReutilizavel');
  const labelQuantidade = document.getElementById('labelQuantidade');

  const formGroupTamanho = document.getElementById('formGroupTamanho');
  const formGroupReutilizavel = document.getElementById('formGroupReutilizavel');

  if (labelNome) {
    labelNome.innerHTML = 'Nome: <span class="required-text">*</span>';
  }
  if (formGroupTamanho) {
    formGroupTamanho.style.display = 'block';
  }
  if (labelTamanho) {
    labelTamanho.innerHTML = 'Tamanho: <span class="optional-text">(Opcional)</span>';
  }
  if (formGroupReutilizavel) {
    formGroupReutilizavel.style.display = 'block';
  }
  if (labelReutilizavel) {
    labelReutilizavel.innerHTML = 'Reutilizável: <span class="required-text">*</span>';
  }
  if (labelQuantidade) {
    labelQuantidade.innerHTML = 'Quantidade: <span class="required-text">*</span>';
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
  if (name) {
    name.value = data.name || (card.querySelector('h3')?.textContent || '').trim();
    name.disabled = true;
  }
  if (size) {
    size.value = data.size || '';
    size.disabled = false;
  }
  if (totalQuantity) {
    const q = data.quantity || card.querySelector('b')?.textContent || 1;
    totalQuantity.value = toInt(q, 1);
  }
  if (reusable) {
    const reusableValue = data.reusable === 'true' || data.reusable === true;
    reusable.value = reusableValue ? 'sim' : 'nao';
  }

  const title = overlay.querySelector('.popup-title');
  if (title) title.textContent = 'Editar Material';

  const labelNome = document.getElementById('labelNome');
  const labelTamanho = document.getElementById('labelTamanho');
  const labelReutilizavel = document.getElementById('labelReutilizavel');
  const labelQuantidade = document.getElementById('labelQuantidade');

  const formGroupTamanho = document.getElementById('formGroupTamanho');
  const formGroupReutilizavel = document.getElementById('formGroupReutilizavel');

  if (labelNome) {
    labelNome.innerHTML = 'Nome:';
  }
  if (formGroupTamanho) {
    formGroupTamanho.style.display = 'none';
  }
  if (formGroupReutilizavel) {
    formGroupReutilizavel.style.display = 'block';
  }
  if (labelReutilizavel) {
    labelReutilizavel.innerHTML = 'Reutilizável: <span class="optional-text">(Opcional)</span>';
  }
  if (labelQuantidade) {
    labelQuantidade.innerHTML = 'Quantidade: <span class="optional-text">(Opcional)</span>';
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

function fecharPopup() {
  closePopup();
}

async function loadMaterials() {
  const materialContainer = document.getElementById('materials-container');
  if (!materialContainer) return;

  materialContainer.innerHTML = '';

  try {
    const materials = await getAllMaterials();
    const lista = materials?.materials || [];

    lista.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

    lista.forEach((material) => {
      const card = document.createElement('div');
      card.className = 'col-12 col-sm-6 col-lg-4';

      const itemCard = document.createElement('div');
      itemCard.className = 'item-card';

      const id = material.id || material._id || '';
      if (id) itemCard.dataset.id = id;
      itemCard.dataset.name = material.name || '';
      itemCard.dataset.size = material.size || '';
      itemCard.dataset.quantity = material.totalQuantity ?? '';
      if (material.reusable !== undefined) {
        itemCard.dataset.reusable = String(material.reusable);
      }

      const h3 = document.createElement('h3');
      const sizeText = material.size ? ` (${material.size})` : '';
      h3.innerText = `${material.name}${sizeText}`;

      const p = document.createElement('p');
      p.innerText = 'Quantidade: ';

      const b = document.createElement('b');
      b.innerText = material.totalQuantity;

      p.appendChild(b);

      const p2 = document.createElement('p');
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