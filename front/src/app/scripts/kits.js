// Inicializa o modal e elementos estáticos fora da função loadKits
setupToastContainer();

const modalElement = document.getElementById('novoKitModal');
const modal = new bootstrap.Modal(modalElement);

const editModalElement = document.getElementById('editKitModal');
const editModal = new bootstrap.Modal(editModalElement);

const form = document.getElementById("itemForm");

const editForm = document.getElementById("editItemForm");

let currentEditingKit = null; // Store the kit being edited

// Helper to decode JWT
function parseJwt(token) {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Get user info
const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;
// const user = parseJwt(token);
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();

  // Collect materials from the list
  const materialsContainer = document.getElementById("addKitMaterialsList");
  const inputs = materialsContainer.querySelectorAll("input");
  const materials = [];

  inputs.forEach(input => {
    const qty = parseInt(input.value);
    if (!isNaN(qty) && qty > 0) {
      materials.push({
        materialId: input.dataset.id,
        selectedQuantity: qty
      });
    }
  });

  if (nome.length < 3) {
    showToast("O nome do kit deve ter pelo menos 3 caracteres.", 'warning');
    return;
  }

  if (materials.length === 0) {
    showToast("Selecione pelo menos um material para o kit.", 'warning');
    return;
  }

  try {
    await createKit(materials, nome);

    showToast('Kit criado com sucesso!', 'success');

    setTimeout(() => {
      modal.hide();
      form.reset();
      loadKits(); // Recarrega a lista de kits
    }, 1000);
  } catch (error) {
    console.error("Erro ao criar kit:", error);
    const msg = error.response?.data?.message || "Erro ao criar o kit. Verifique o console.";
    showToast(msg, 'error');
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
        // Only include material if quantity is greater than 0
        if (!isNaN(qty) && qty > 0) {
          materials.push({
            materialId: input.dataset.id,
            selectedQuantity: qty
          });
        }
      });

      if (materials.length === 0) {
        showToast("Selecione pelo menos um material com quantidade maior que 0.", 'warning');
        return;
      }

      // Prepare data for update
      const updateData = {
        name: nome,
        materials: materials
      };
      console.log(updateData)
      await updateKit(id, updateData);

      showToast('Kit atualizado com sucesso!', 'success');

      setTimeout(() => {
        editModal.hide();
        editForm.reset();
        currentEditingKit = null;
        loadKits(); // Reload list
      }, 1000);
    } catch (error) {
      showToast('Erro ao atualizar o kit. Tente novamente.', 'error');
      console.error(error);
    }
  } else {
    showToast("Preencha todos os campos!", 'warning');
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

        const originP = document.createElement('p');
        // Format origin for display (e.g. "INDIVIDUAL" -> "Individual")
        const formattedOrigin = kit.origin ? kit.origin.charAt(0).toUpperCase() + kit.origin.slice(1).toLowerCase() : 'Desconhecida';
        originP.innerHTML = `<b>Origem:</b> ${formattedOrigin}`;
        kitCard.appendChild(originP);

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

          editButton.addEventListener('click', async (e) => {
            e.stopPropagation();

            // Populate modal
            document.getElementById("editKitId").value = kit.id;
            document.getElementById("editNome").value = kit.name;

            const list = document.getElementById("editMaterialsList");
            const select = document.getElementById("newMaterialSelect");
            const addBtn = document.getElementById("addMaterialBtn");

            list.innerHTML = "<p class='text-center'>Carregando materiais...</p>";

            try {
              // Only fetch materials, we don't need other kits anymore
              const allMaterialsResponse = await getAllMaterials();
              const allMaterials = allMaterialsResponse.materials || [];

              // Initialize active materials from kit
              let activeMaterials = [];
              if (kit.materials) {
                activeMaterials = kit.materials.map(km => {
                  if (!km.material) return null;

                  const kitMatId = String(km.material.id || km.material._id || km.material.materialId);
                  let fullMat = allMaterials.find(m => String(m.id) === kitMatId);

                  // Simple total quantity from the material definition
                  const totalQty = fullMat ? fullMat.totalQuantity : 999;

                  return {
                    id: fullMat ? fullMat.id : kitMatId,
                    name: fullMat ? fullMat.name : km.material.name,
                    size: fullMat ? fullMat.size : km.material.size,
                    totalQuantity: totalQty,
                    selectedQuantity: km.selectedQuantity
                  };
                }).filter(item => item !== null);
              }

              // Function to render the UI
              function renderEditUI() {
                list.innerHTML = "";
                select.innerHTML = '<option selected disabled value="">Escolha seus materiais...</option>';

                // 1. Render Active List
                if (activeMaterials.length > 0) {
                  activeMaterials.forEach((mat, index) => {
                    const row = document.createElement("div");
                    row.className = "d-flex justify-content-between align-items-center mb-2 p-2 border-bottom";

                    const label = document.createElement("span");
                    // Display Total Quantity (Max)
                    label.innerText = `${mat.name} ${mat.size ? mat.size : ''} (Max: ${mat.totalQuantity})`;
                    label.style.fontWeight = "500";

                    const controlsDiv = document.createElement("div");
                    controlsDiv.className = "d-flex align-items-center gap-2";

                    const input = document.createElement("input");
                    input.type = "number";
                    input.className = "form-control form-control-sm";
                    input.style.width = "80px";
                    input.value = mat.selectedQuantity;
                    input.min = 1;
                    input.max = mat.totalQuantity;
                    input.dataset.id = mat.id;

                    input.addEventListener('change', (e) => {
                      let val = parseInt(e.target.value);
                      if (val > mat.totalQuantity) {
                        val = mat.totalQuantity;
                        showToast(`Quantidade máxima disponível é ${mat.totalQuantity}`, 'warning');
                      } else if (val < 1) {
                        val = 1;
                      }
                      e.target.value = val;
                      activeMaterials[index].selectedQuantity = val;
                    });

                    const removeBtn = document.createElement("button");
                    removeBtn.className = "btn btn-sm btn-danger";
                    removeBtn.innerHTML = "&times;";
                    removeBtn.title = "Remover material";
                    removeBtn.onclick = () => {
                      activeMaterials.splice(index, 1);
                      renderEditUI();
                    };

                    controlsDiv.appendChild(input);
                    controlsDiv.appendChild(removeBtn);

                    row.appendChild(label);
                    row.appendChild(controlsDiv);
                    list.appendChild(row);
                  });
                } else {
                  list.innerHTML = "<p class='text-center text-muted'>Nenhum material no kit.</p>";
                }

                // 2. Render Available Dropdown
                const activeIds = new Set(activeMaterials.map(m => m.id));
                const available = allMaterials.filter(m => !activeIds.has(m.id));

                available.forEach(mat => {
                  const option = document.createElement("option");
                  option.value = mat.id;
                  option.innerText = `${mat.name} ${mat.size ? mat.size : ''} (Max: ${mat.totalQuantity})`;
                  select.appendChild(option);
                });
              }

              // Initial Render
              renderEditUI();

              // Add Button Handler
              addBtn.onclick = () => {
                const selectedId = select.value;
                if (!selectedId) return;

                const matToAdd = allMaterials.find(m => String(m.id) === selectedId);
                if (matToAdd) {
                  activeMaterials.push({
                    id: matToAdd.id,
                    name: matToAdd.name,
                    size: matToAdd.size,
                    totalQuantity: matToAdd.totalQuantity,
                    selectedQuantity: 1
                  });
                  renderEditUI();
                }
              };

            } catch (err) {
              console.error("Erro ao carregar materiais para edição:", err);
              list.innerHTML = "<p class='text-center text-danger'>Erro ao carregar materiais.</p>";
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

  addCard.addEventListener('click', async (e) => {
    e.preventDefault();
    e.currentTarget.blur();

    // Reset form and UI
    form.reset();
    const list = document.getElementById("addKitMaterialsList");
    const select = document.getElementById("addKitMaterialSelect");
    const addBtn = document.getElementById("addKitMaterialBtn");

    list.innerHTML = "<p class='text-center'>Carregando materiais...</p>";
    select.innerHTML = '<option selected disabled value="">Carregando...</option>';

    let activeMaterials = [];

    try {
      const allMaterialsResponse = await getAllMaterials();
      const allMaterials = allMaterialsResponse.materials || [];

      function renderCreateUI() {
        list.innerHTML = "";
        select.innerHTML = '<option selected disabled value="">Escolha seus materiais...</option>';

        // 1. Render Active List
        if (activeMaterials.length > 0) {
          activeMaterials.forEach((mat, index) => {
            const row = document.createElement("div");
            row.className = "d-flex justify-content-between align-items-center mb-2 p-2 border-bottom";

            const label = document.createElement("span");
            label.innerText = `${mat.name} ${mat.size ? mat.size : ''} (Max: ${mat.totalQuantity})`;
            label.style.fontWeight = "500";

            const controlsDiv = document.createElement("div");
            controlsDiv.className = "d-flex align-items-center gap-2";

            const input = document.createElement("input");
            input.type = "number";
            input.className = "form-control form-control-sm";
            input.style.width = "80px";
            input.value = mat.selectedQuantity;
            input.min = 1;
            input.max = mat.totalQuantity;
            input.dataset.id = mat.id;

            input.addEventListener('change', (e) => {
              let val = parseInt(e.target.value);
              if (val > mat.totalQuantity) {
                val = mat.totalQuantity;
                showToast(`Quantidade máxima disponível é ${mat.totalQuantity}`, 'warning');
              } else if (val < 1) {
                val = 1;
              }
              e.target.value = val;
              activeMaterials[index].selectedQuantity = val;
            });

            const removeBtn = document.createElement("button");
            removeBtn.className = "btn btn-sm btn-danger";
            removeBtn.innerHTML = "&times;";
            removeBtn.title = "Remover material";
            removeBtn.onclick = () => {
              activeMaterials.splice(index, 1);
              renderCreateUI();
            };

            controlsDiv.appendChild(input);
            controlsDiv.appendChild(removeBtn);

            row.appendChild(label);
            row.appendChild(controlsDiv);
            list.appendChild(row);
          });
        } else {
          list.innerHTML = "<p class='text-center text-muted'>Nenhum material selecionado.</p>";
        }

        // 2. Render Available Dropdown
        const activeIds = new Set(activeMaterials.map(m => m.id));
        const available = allMaterials.filter(m => !activeIds.has(m.id));

        available.forEach(mat => {
          const option = document.createElement("option");
          option.value = mat.id;
          option.innerText = `${mat.name} ${mat.size ? mat.size : ''} (Max: ${mat.totalQuantity})`;
          select.appendChild(option);
        });
      }

      renderCreateUI();

      addBtn.onclick = () => {
        const selectedId = select.value;
        if (!selectedId) return;

        const matToAdd = allMaterials.find(m => String(m.id) === selectedId);
        if (matToAdd) {
          activeMaterials.push({
            id: matToAdd.id,
            name: matToAdd.name,
            size: matToAdd.size,
            totalQuantity: matToAdd.totalQuantity,
            selectedQuantity: 1
          });
          renderCreateUI();
        }
      };

    } catch (err) {
      console.error("Erro ao carregar materiais:", err);
      list.innerHTML = "<p class='text-center text-danger'>Erro ao carregar materiais.</p>";
    }

    modal.show();
  });

  plusCard.appendChild(addCard);
  kitContainer.appendChild(plusCard);
}

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