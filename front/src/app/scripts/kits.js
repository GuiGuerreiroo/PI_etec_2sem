// Inicializa o modal e elementos estáticos fora da função loadKits
const modalElement = document.getElementById('novoKitModal');
const modal = new bootstrap.Modal(modalElement);

const editModalElement = document.getElementById('editKitModal');
const editModal = new bootstrap.Modal(editModalElement);

const closeModal = document.getElementById('closeModal');
closeModal.addEventListener('click', () => {
  modal.hide();
});

const closeEditModal = document.getElementById('closeEditModal');
closeEditModal.addEventListener('click', () => {
  editModal.hide();
});

const form = document.getElementById("itemForm");
const successMessage = document.getElementById("successMessage");

const editForm = document.getElementById("editItemForm");
const editSuccessMessage = document.getElementById("editSuccessMessage");

let currentEditingKit = null; // Store the kit being edited

// Helper to decode JWT
function parseJwt(token) {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Get user info
const token = localStorage.getItem('token') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmJlZTkyNWY4ZmIxOGRiY2U4ZWNiOSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc2MzgzMjY1NywiaWF0IjoxNzYzNzQ2MjU3fQ.QAFaNmFT6a_OheP7z9cJj8Q_ZtqhMKjRS14lIIYB358";
// const user = parseJwt(token);
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

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
      loadKits(); // Recarrega a lista de kits
    }, 5000);
  } else {
    alert("Preencha todos os campos antes de criar o kit!");
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editKitId").value;
  const nome = document.getElementById("editNome").value.trim();

  if (nome !== "" && currentEditingKit) {
    try {
      // Collect materials from the list
      const materialsContainer = document.getElementById("editMaterialsList");
      const inputs = materialsContainer.querySelectorAll("input");
      const materials = [];
      
      inputs.forEach(input => {
          const qty = parseInt(input.value);
          // Include material if quantity is valid (assuming 0 is allowed or means remove, but let's keep it simple)
          if (!isNaN(qty) && qty >= 0) {
               materials.push({
                   materialId: input.dataset.id,
                   selectedQuantity: qty
               });
          }
      });

      // Prepare data for update
      const updateData = {
        name: nome,
        materials: materials
      };

      await updateKit(id, updateData);

      editSuccessMessage.classList.add("show");

      setTimeout(() => {
        editSuccessMessage.classList.remove("show");
        editModal.hide();
        editForm.reset();
        currentEditingKit = null;
        loadKits(); // Reload list
      }, 2000);
    } catch (error) {
      alert("Erro ao atualizar o kit. Tente novamente.");
      console.error(error);
    }
  } else {
    alert("Preencha todos os campos!");
  }
});

async function loadKits() {
  const kitContainer = document.getElementById('kits-container');
  
  // Limpa o container para evitar duplicatas
  kitContainer.innerHTML = '';

  try {
    const kits = await getAllKits();
    console.log(kits.kits);

    if (kits && kits.kits) {
      kits.kits.forEach((kit) => {
        const card = document.createElement('div');
        card.className = 'col-12 col-sm-6 col-lg-4';

        const kitCard = document.createElement('div');
        kitCard.className = 'kit-card';
        kitCard.dataset.id = kit.id;

        const h3 = document.createElement('h3');
        h3.innerText = kit.name;
        
        kitCard.appendChild(h3);
        
        const materialsList = document.createElement('div');
        materialsList.className = 'materials-list';

        if (kit.materials) {
          kit.materials.forEach((material) => {
            let p = document.createElement('p');
            p.innerText = `${material.material.name} ${material.material.size ? material.material.size : ''}: `;
        
            let b = document.createElement('b');
            b.innerText = material.selectedQuantity;
        
            p.appendChild(b);
            materialsList.appendChild(p);
          })
        }
        kitCard.appendChild(materialsList);

        // Logic to show edit button
        let showEditButton = false;
        if (user) {
          if (user.role === 'PROFESSOR') {
             // Professor can only edit individual kits they own
             if (kit.origin === 'INDIVIDUAL' && kit.userName === user.name) {
               showEditButton = true;
             }
          } else if (user.role === 'MODERATOR' || user.role === 'ADMIN') {
            // Moderator and Admin can only edit general kits
            if (kit.origin === 'GERAL') {
              showEditButton = true;
            }
          }
        }

        if (showEditButton) {
          const editButton = document.createElement('button');
          editButton.className = 'editar';
          editButton.innerText = 'Editar';
          editButton.dataset.id = kit.id;

          editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Populate modal
            document.getElementById("editKitId").value = kit.id;
            document.getElementById("editNome").value = kit.name;
            
            // Populate materials list
            const list = document.getElementById("editMaterialsList");
            list.innerHTML = "";
            
            if (kit.materials && kit.materials.length > 0) {
                kit.materials.forEach(m => {
                    const row = document.createElement("div");
                    row.className = "d-flex justify-content-between align-items-center mb-2";
                    
                    const label = document.createElement("span");
                    label.innerText = `${m.material.name} ${m.material.size ? m.material.size : ''}`;
                    label.style.color = "#004e56";
                    label.style.fontWeight = "500";
                    
                    const input = document.createElement("input");
                    input.type = "number";
                    input.className = "form-control form-control-sm";
                    input.style.width = "80px";
                    input.value = m.selectedQuantity;
                    input.min = 0;
                    input.dataset.id = m.material.id; // Catch by ID
                    
                    row.appendChild(label);
                    row.appendChild(input);
                    list.appendChild(row);
                });
            } else {
                list.innerHTML = "<p class='text-center text-muted'>Nenhum material neste kit.</p>";
            }

            currentEditingKit = kit;
            editModal.show();
          });
          kitCard.appendChild(editButton);
        }
        
        card.appendChild(kitCard);
        
        kitContainer.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar kits:", error);
  }

  // Adiciona o card de adicionar novo kit
  const plusCard = document.createElement('div');
  plusCard.className = 'col-12 col-sm-6 col-lg-4';

  const addCard = document.createElement('div');
  addCard.className = 'add-card';
  addCard.id = 'addCard';
  addCard.innerHTML = '<span>+</span>';

  addCard.addEventListener('click', (e) => {
    e.preventDefault();
    e.currentTarget.blur();
    modal.show();
  });

  plusCard.appendChild(addCard);
  kitContainer.appendChild(plusCard);
}