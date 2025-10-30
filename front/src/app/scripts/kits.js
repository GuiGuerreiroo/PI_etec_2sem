const addCard = document.getElementById('addCard');
const modal = new bootstrap.Modal(document.getElementById('novoKitModal'));

addCard.addEventListener('click', (e) => {
  e.preventDefault();
  // remove foco visual do botao
  e.currentTarget.blur();
  // abre o modal
  modal.show();
});

const closeModal = document.getElementById('closeModal');
closeModal.addEventListener('click', () => {
  modal.hide();
});

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
    }, 5000);
  } else {
    alert("Preencha todos os campos antes de criar o kit!");
  }
});