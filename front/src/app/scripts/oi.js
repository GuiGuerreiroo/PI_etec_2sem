
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const criarKitBtn = document.getElementById('criarKitBtn');
const cardsContainer = document.getElementById('cardsContainer');
const nomeKitInput = document.getElementById('nomeKit');

popupClose.addEventListener("click", () => {
  closePopup();
});

popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) {
    closePopup();
  }
});

function abrirPopup() {
  popupOverlay.classList.add("ativo");
  popupOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = "hidden"; 
  loadMaterialsIntoPopup();
}

function closePopup() {
  popupOverlay.classList.remove("ativo");
  popupOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = "";
}

criarKitBtn.addEventListener('click', async () => {
  const nome = nomeKitInput.value.trim();
  if (!nome) {
    alert("Digite o nome do KIT antes de criar.");
    return;
  }

  try {
    if (typeof createKit === "function") {
      await createKit({ name: nome  });
    } else {
      console.log("createKit() não encontrada - simulando criação local:", nome);
    }
  } catch (err) {
    console.error("Erro ao criar kit:", err);
    alert("Erro ao criar kit. Veja console.");
    return;
  }

  closePopup();
  nomeKitInput.value = '';
  if (typeof loadKits === "function") {
    loadKits();
  }
});

async function loadMaterialsIntoPopup() {
  cardsContainer.innerHTML = '';

  if (typeof getAllMaterials !== "function") {
    const placeholder = document.createElement('div');
    placeholder.className = "text-muted";
    cardsContainer.appendChild(placeholder);
    return;
  }

  try {
    const materials = await getAllMaterials();
    const list = materials?.materials || materials?.material || [];

    if (!Array.isArray(list) || list.length === 0) {
      const none = document.createElement('div');
      none.innerText = "Nenhum material encontrado.";
      none.className = "text-muted";
      cardsContainer.appendChild(none);
      return;
    }

    list.forEach((material) => {
      const el = document.createElement('div');
      el.className = 'card';
      el.style.maxWidth = '200px';
      el.innerHTML = `
        <h3>${material.name || ''} ${material.size || ''}</h3>
        <p>Quantidade: <b>${material.totalQuantity ?? material.quantity ?? 0}</b></p>
        <button class="combo-quantidade">1x</button>
      `;
      cardsContainer.appendChild(el);
    });

  } catch (err) {
    console.error("Erro ao carregar materiais:", err);
    const errEl = document.createElement('div');
    errEl.innerText = "Erro ao carregar materiais. Veja console.";
    cardsContainer.appendChild(errEl);
  }
}

async function loadKits() {
  const kitContainer = document.getElementById('kits-container');
  if (!kitContainer) return;

  kitContainer.innerHTML = '';

  if (typeof getAllKits !== "function") {
    const placeholder = document.createElement('div');
    placeholder.className = 'col-12';
    kitContainer.appendChild(placeholder);
    appendPlusCard(kitContainer);
    return;
  }

  try {
    const kits = await getAllKits();
    const list = kits?.kits || kits?.data || [];

    // popula cards
    if (Array.isArray(list) && list.length > 0) {
      list.forEach((kit) => {
        const card = document.createElement('div');
        card.className = 'col-12 col-sm-6 col-lg-4';

        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';

        const h3 = document.createElement('h3');
        h3.innerText = kit.name || 'Kit sem nome';

        const p = document.createElement('p');
        p.innerText = 'Quantidade: ';

        const b = document.createElement('b');
        b.innerText = kit.totalQuantity ?? kit.quantity ?? 0;

        p.appendChild(b);

        const editButton = document.createElement('button');
        editButton.className = 'editar btn btn-sm btn-outline-secondary mt-2';
        editButton.innerText = 'Editar';

        itemCard.appendChild(h3);
        itemCard.appendChild(p);
        itemCard.appendChild(editButton);

        card.appendChild(itemCard);
        kitContainer.appendChild(card);
      });
    }

    appendPlusCard(kitContainer);

  } catch (err) {
    console.error("Erro ao obter kits:", err);
    const errEl = document.createElement('div');
    errEl.className = 'col-12 text-danger';
    errEl.innerText = 'Erro ao carregar kits. Veja console.';
    kitContainer.appendChild(errEl);

    appendPlusCard(kitContainer);
  }
}

function appendPlusCard(container) {
  const plusCard = document.createElement('div');
  plusCard.className = 'col-12 col-sm-6 col-lg-4';

  const addCard = document.createElement('div');
  addCard.className = 'add-card';
  addCard.innerHTML = '<span>+</span>';

  addCard.addEventListener('click', (e) => {
    e.preventDefault();
    e.currentTarget.blur();
    abrirPopup();
  });

  plusCard.appendChild(addCard);
  container.appendChild(plusCard);
}
