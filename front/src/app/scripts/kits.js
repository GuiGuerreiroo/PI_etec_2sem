const addCard = document.getElementById('addCard');
const modal = new bootstrap.Modal(document.getElementById('novoKitModal'));

// addCard.addEventListener('click', (e) => {
//   e.preventDefault();
//   // remove foco visual do botao
//   e.currentTarget.blur();
//   // abre o modal
//   modal.show();
// });

// const closeModal = document.getElementById('closeModal');
// closeModal.addEventListener('click', () => {
//   modal.hide();
// });

const form = document.getElementById("itemForm");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if (nome !== "" && descricao !== "") {
    successMessage.classList.add("show");

    setTimeout(() => {
      successMessage.classList.remove("show");
      modal.hide();
      form.reset();
      loadKits();
    }, 5000);
  } else {
    alert("Preencha todos os campos antes de criar o kit!");
  }
});


async function loadKits() {
 
  const kits = await getAllKits();
  

  console.log(kits.kits); 

 
  const kitContainer = document.getElementById('kits-container'); 

  // kitContainer.innerHTML = ''; limpar o container ára n ter duplicatas se rodar 2x
  
  kits.kits.forEach((kit) => {


    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-lg-4';

    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';

  
    const h3 = document.createElement('h3');
  
    h3.innerText = kit.name;

    const p = document.createElement('p');
    p.innerText = 'Quantidade: '; 

    const b = document.createElement('b');
    b.innerText = kit.totalQuantity;

    p.appendChild(b);

    const editButton = document.createElement('button');
    editButton.className = 'editar';
    editButton.innerText = 'Editar';

    itemCard.appendChild(h3);
    itemCard.appendChild(p);
    itemCard.appendChild(editButton);

    card.appendChild(itemCard);

    kitContainer.appendChild(card);
  
});
  const plusCard = document.createElement('div');
  plusCard.className = 'col-12 col-sm-6 col-lg-4';

  const addCard = document.createElement('div');
  addCard.className = 'add-card';
  addCard.id = 'addCard';
  addCard.innerHTML = '<span>+</span>';

 addCard.addEventListener('click', (e) => {
  e.preventDefault();
  // remove foco visual do botao
  e.currentTarget.blur();
  // abre o modal
  modal.show();
});


  plusCard.appendChild(addCard);
  kitContainer.appendChild(plusCard);

}