document.addEventListener('DOMContentLoaded', () => {
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
    
    setupToastContainer();
});

async function loadMaterials() {
    const materials = {
        materials: [
            { name: "Tijolo", size: "Pequeno", totalQuantity: 50, reutilizavel: "Sim" },
            { name: "Cimento", size: "", totalQuantity: 10, reutilizavel: "Não" },
            { name: "Madeira", size: "2x4", totalQuantity: 30, reutilizavel: "Sim" }
        ]
    };

    console.log(materials.materials);

    const materialContainer = document.getElementById('materials-container');
    materialContainer.innerHTML = ''; 

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

    const plusCard = document.createElement('div');
    plusCard.className = 'col-12 col-sm-6 col-lg-4';
    const addCard = document.createElement('div');
    addCard.className = 'add-card';
    addCard.innerHTML = '<span>+</span>';
    plusCard.appendChild(addCard);
    materialContainer.appendChild(plusCard);
    
    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('Função de edição em desenvolvimento.');
        });
    });
}

document.addEventListener("click", (e) => {
    if (e.target.closest(".add-card")) {
        document.getElementById("popupOverlay").style.display = "flex";
    }
});

document.getElementById("popupAdicionar").addEventListener("click", () => {
    const nomeInput = document.getElementById("popupNome");
    const tamanhoInput = document.getElementById("popupTamanho");
    const reutilizavelInput = document.getElementById("popupReutilizavel");
    const quantidadeInput = document.getElementById("popupQuantidade");

    if (!nomeInput.value.trim()) {
        showToast("O campo Nome é obrigatório.", 'warning');
        nomeInput.focus();
        return;
    }

    const qtdValor = parseInt(quantidadeInput.value);
    if (!quantidadeInput.value || isNaN(qtdValor) || qtdValor <= 0) {
        showToast("A quantidade deve ser um número inteiro maior que 0.", 'warning');
        quantidadeInput.focus();
        return;
    }

    const nome = nomeInput.value;
    const tamanho = tamanhoInput.value; 
    const reutilizavel = reutilizavelInput.value;
    const quantidade = qtdValor; 

    console.log("Novo Material:", nome, tamanho, reutilizavel, quantidade);
    
    showToast("Material adicionado com sucesso!", 'success');

    document.getElementById("popupOverlay").style.display = "none";

    nomeInput.value = "";
    tamanhoInput.value = "";
    quantidadeInput.value = "1";
});

function fecharPopup() {
    document.querySelector('.popup-overlay').style.display = 'none';
}

// function setupToastContainer() {
//     if (!document.getElementById('toastContainer')) {
//         const toastContainer = document.createElement('div');
//         toastContainer.id = 'toastContainer';
//         toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3'; 
//         toastContainer.style.zIndex = '9999'; 
//         document.body.appendChild(toastContainer);
//     }
// }

// function showToast(message, type = 'success') {
//     if (typeof bootstrap === 'undefined' || typeof bootstrap.Toast === 'undefined') {
//         console.error("Bootstrap JS (e a classe Toast) não está carregado. Usando alert como fallback.");
//         alert(message);
//         return;
//     }
    
//     const toastId = 'toast-' + Date.now();
    
//     const typeMapping = {
//         'success': { bgColor: 'bg-success', icon: 'fa-check-circle' },
//         'error': { bgColor: 'bg-danger', icon: 'fa-exclamation-circle' },
//         'warning': { bgColor: 'bg-warning', icon: 'fa-exclamation-triangle' },
//         'info': { bgColor: 'bg-info', icon: 'fa-info-circle' }
//     };
    
//     const { bgColor, icon } = typeMapping[type] || typeMapping['info'];

//     const toastHTML = `
//         <div id="${toastId}" class="toast align-items-center text-white ${bgColor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
//             <div class="d-flex">
//                 <div class="toast-body">
//                     <i class="fas ${icon} me-2"></i>
//                     ${message}
//                 </div>
//                 <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
//             </div>
//         </div>
//     `;

//     const container = document.getElementById('toastContainer');
//     if (!container) {
//         setupToastContainer();
//     }
//     document.getElementById('toastContainer').insertAdjacentHTML('beforeend', toastHTML);

//     const toastElement = document.getElementById(toastId);
    
//     const toast = new bootstrap.Toast(toastElement, {
//         autohide: true,
//         delay: 4000
//     });

//     toast.show();

//     toastElement.addEventListener('hidden.bs.toast', () => {
//         toastElement.remove();
//     });
// }