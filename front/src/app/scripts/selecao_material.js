// ----- ADICIONAR CARDS DINAMICAMENTE -----
const addBtn = document.getElementById("addBtn");
const cardsContainer = document.getElementById("cardsContainer");
let materialCount = 0;

async function loadMaterials() {
  const materials = await getAllMaterials();
  console.log(materials.materials);

  const materialContainer = document.getElementById('materials-container');

  materials.materials.forEach((material) => {

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
}