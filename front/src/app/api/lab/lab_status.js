class ReservationsManager {
    constructor() {
        this.reservations = [];
        this.filteredReservations = [];
        this.isLoading = false;
        this.setupEventListeners();
        this.loadReservations();
    }

    getToken() {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
            try {
                return JSON.parse(tokenData);
            } catch (e) {
                return tokenData;
            }
        }
        return null;
    }

    setupEventListeners() {
        document.querySelectorAll('.dropdown-menu input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.handleFilterChange(e.target);
            });
        });
    }

    handleFilterChange(clickedCheckbox) {
        const dropdown = clickedCheckbox.closest('.dropdown-menu');
        const allCheckbox = dropdown.querySelector('input[type="checkbox"]:first-child');
        const otherCheckboxes = dropdown.querySelectorAll('input[type="checkbox"]:not(:first-child)');

        if (clickedCheckbox === allCheckbox && clickedCheckbox.checked) {
            otherCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }
        else if (clickedCheckbox !== allCheckbox) {
            allCheckbox.checked = false;
            
            const anySpecificChecked = Array.from(otherCheckboxes).some(cb => cb.checked);
            if (!anySpecificChecked) {
                allCheckbox.checked = true;
            }
        }

        this.applyFilters();
    }

    async loadReservations() {
        if (this.isLoading) {
            console.log('Carregamento já em andamento...');
            return;
        }

        const token = this.getToken();
        if (!token) {
            console.error('Token não disponível para carregar reservas');
            alert('Usuário não autenticado. Redirecionando para login...');
            window.location.href = 'login.html';
            return;
        }

        this.isLoading = true;

        try {
            const url = 'http://localhost:3000/api/reservations';
            console.log('Carregando reservas de:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Status da resposta:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Dados recebidos:', data);
                
                if (data.reservations && Array.isArray(data.reservations)) {
                    this.reservations = data.reservations;
                    this.filteredReservations = [...this.reservations];
                    this.populateTable();
                    console.log('Reservas carregadas com sucesso:', this.reservations.length);
                    this.updateLabFilters();
                } else {
                    console.error('Formato de dados inválido:', data);
                    this.reservations = [];
                    this.filteredReservations = [];
                    this.showErrorMessage('Formato de dados inválido da API');
                }
                
            } else if (response.status === 401) {
                console.log('Não autorizado - redirecionando para login');
                this.handleUnauthorized();
            } else {
                const errorText = await response.text();
                console.error('Erro ao carregar reservas:', response.status, errorText);
                this.reservations = [];
                this.filteredReservations = [];
                this.showErrorMessage('Erro ao carregar reservas: ' + errorText);
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            this.reservations = [];
            this.filteredReservations = [];
            this.showErrorMessage('Erro de conexão ao carregar reservas');
        } finally {
            this.isLoading = false;
        }
    }

    updateLabFilters() {
        const labNames = [...new Set(this.reservations.map(reservation => reservation.labName).filter(Boolean))];
        
        const labDropdown = document.querySelector('.dropdown:nth-child(2) .dropdown-menu');
        if (!labDropdown) return;

        const otherCheckboxes = labDropdown.querySelectorAll('input[type="checkbox"]:not(:first-child)');
        const otherLabels = labDropdown.querySelectorAll('label:not(:first-child)');
        
        otherCheckboxes.forEach(cb => cb.remove());
        otherLabels.forEach(label => label.remove());

        labNames.forEach(labName => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <label class="dropdown-item">
                    <input type="checkbox" class="form-check-input me-2" data-lab-name="${labName}">
                    ${labName}
                </label>
            `;
            labDropdown.appendChild(listItem);
        });
        
        labDropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.handleFilterChange(e.target);
            });
        });
    }

    populateTable() {
        const tableContainer = document.querySelector('.table-container');
        const tbody = document.querySelector('.table-custom tbody');
        
        if (!tbody || !tableContainer) {
            console.error('Elementos da tabela não encontrados');
            return;
        }
        
        tbody.innerHTML = '';

        if (this.filteredReservations.length === 0) {
            this.showNoResultsMessage(tbody);
            return;
        }

        this.filteredReservations.forEach((reservation, index) => {
            const tr = tbody.insertRow();
        
            const tdProfessor = tr.insertCell();
            tdProfessor.textContent = reservation.userName || 'N/A';
            
            const tdStatus = tr.insertCell();
            const statusBadge = this.getStatusBadge(reservation.status);
            tdStatus.innerHTML = statusBadge;
            
            const statusElement = tdStatus.querySelector('.status-badge');
            if (statusElement) {
                statusElement.style.cursor = 'pointer';
                statusElement.addEventListener('click', () => {
                    this.handleStatusClick(reservation, index);
                });
            }
            
            const tdKit = tr.insertCell();
            const kitName = reservation.kit?.name || 'Kit';
            tdKit.innerHTML = `<span class="kit-badge badge" style="cursor: pointer;">${kitName}</span>`;
            
            const kitElement = tdKit.querySelector('.kit-badge');
            if (kitElement) {
                kitElement.addEventListener('click', () => {
                    this.showKitMaterials(reservation.kit);
                });
            }
            
            const tdDataReserva = tr.insertCell();
            tdDataReserva.textContent = this.formatDate(reservation.date);
            
            const tdHorario = tr.insertCell();
            tdHorario.textContent = reservation.hour || 'N/A';
            
            const tdLaboratorio = tr.insertCell();
            tdLaboratorio.textContent = reservation.labName || 'N/A';
            
            const tdDataCriacao = tr.insertCell();
            tdDataCriacao.textContent = this.formatDate(reservation.createdAt || reservation.date);
        });
    }

    handleStatusClick(reservation, index) {
        const newStatus = reservation.status === 'MARCADO' ? 'CONCLUIDO' : 'MARCADO';
        
        if (newStatus === 'CONCLUIDO') {
            this.showConfirmationModal(reservation, index);
        } else {
            if (confirm(`Deseja alterar o status da reserva para "Pendente"?`)) {
                this.updateReservationStatus(reservation.id, newStatus, index);
            }
        }
    }

    showConfirmationModal(reservation, index) {
        const modalHTML = `
            <div class="modal fade" id="confirmCompletionModal" tabindex="-1" aria-labelledby="confirmCompletionModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="confirmCompletionModalLabel">
                                <i class="fas fa-check-circle me-2"></i>
                                Confirmar Conclusão da Reserva
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-4">
                                <div class="mb-3">
                                    <i class="fas fa-calendar-check fa-3x text-success"></i>
                                </div>
                                <h4 class="text-success mb-3">Marcar como Concluído?</h4>
                                <p class="text-muted">Você está prestes a marcar esta reserva como concluída.</p>
                            </div>
                            
                            <div class="reservation-details card border-0 bg-light">
                                <div class="card-body">
                                    <h6 class="card-title mb-3">
                                        <i class="fas fa-info-circle me-2 text-primary"></i>
                                        Detalhes da Reserva
                                    </h6>
                                    <div class="row">
                                        <div class="col-6">
                                            <small class="text-muted">Professor:</small>
                                            <p class="mb-2 fw-bold">${reservation.userName || 'N/A'}</p>
                                        </div>
                                        <div class="col-6">
                                            <small class="text-muted">Laboratório:</small>
                                            <p class="mb-2 fw-bold">${reservation.labName || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <small class="text-muted">Data:</small>
                                            <p class="mb-2 fw-bold">${this.formatDate(reservation.date)}</p>
                                        </div>
                                        <div class="col-6">
                                            <small class="text-muted">Horário:</small>
                                            <p class="mb-0 fw-bold">${reservation.hour || 'N/A'}</p>
                                        </div>
                                    </div>
                                    ${reservation.kit?.name ? `
                                    <div class="row mt-2">
                                        <div class="col-12">
                                            <small class="text-muted">Kit Utilizado:</small>
                                            <p class="mb-0 fw-bold text-primary">${reservation.kit.name}</p>
                                        </div>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div class="alert alert-warning mt-3" role="alert">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <strong>Atenção:</strong> Esta ação não pode ser desfeita.
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times me-2"></i>
                                Cancelar
                            </button>
                            <button type="button" class="btn btn-success" id="confirmCompletionBtn">
                                <i class="fas fa-check me-2"></i>
                                Sim, Concluir Reserva
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('confirmCompletionModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = new bootstrap.Modal(document.getElementById('confirmCompletionModal'));
        modal.show();

        const confirmBtn = document.getElementById('confirmCompletionBtn');
        confirmBtn.addEventListener('click', () => {
            this.updateReservationStatus(reservation.id, 'CONCLUIDO', index);
            modal.hide();
        });

        modal._element.addEventListener('hidden.bs.modal', () => {
            modal._element.remove();
        });
    }

    async updateReservationStatus(reservationId, newStatus, index) {
        const token = this.getToken();
        if (!token) {
            alert('Token de autenticação não encontrado.');
            return;
        }

        try {
            console.log('Atualizando status da reserva:', reservationId, 'para:', newStatus);
            
            const requestBody = {
                id: reservationId,
                status: newStatus
            };

            console.log('Dados enviados:', requestBody);

            const response = await fetch('http://localhost:3000/api/reservation', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Status da resposta:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Status atualizado com sucesso:', result);
                
                this.reservations[index].status = newStatus;
                this.filteredReservations[index].status = newStatus;
                this.populateTable();
                
                this.showSuccessToast(`Reserva ${newStatus === 'CONCLUIDO' ? 'concluída' : 'marcada como pendente'} com sucesso!`);
                
            } else {
                const errorText = await response.text();
                console.error('Erro ao atualizar status:', errorText);
                
                let errorMessage = 'Erro ao atualizar status. ';
                
                if (response.status === 404) {
                    errorMessage += 'Endpoint não encontrado. Verifique a URL da API.';
                } else if (response.status === 401) {
                    errorMessage += 'Não autorizado. Faça login novamente.';
                    this.handleUnauthorized();
                } else {
                    errorMessage += `Erro ${response.status}: ${errorText}`;
                }
                
                this.showErrorToast(errorMessage);
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            this.showErrorToast('Erro de conexão ao atualizar status. Verifique se o servidor está rodando.');
        }
    }

    showSuccessToast(message) {
        this.showToast(message, 'success', 'check-circle');
    }

    showErrorToast(message) {
        this.showToast(message, 'danger', 'exclamation-triangle');
    }

    showToast(message, type, icon) {
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${type} border-0 position-fixed top-0 end-0 m-3" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${icon} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.querySelector('.toast:last-child');
        const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
        toast.show();
        
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    showKitMaterials(kit) {
        if (!kit || !kit.materials || kit.materials.length === 0) {
            alert('Nenhum material encontrado neste kit.');
            return;
        }

        let materialsHTML = `
            <div class="kit-materials-modal">
                <h5>${kit.name || 'Kit'}</h5>
                <p><strong>Origem:</strong> ${kit.origin || 'N/A'}</p>
                <hr>
                <h6>Materiais:</h6>
                <ul class="list-group">
        `;

        kit.materials.forEach(materialItem => {
            const material = materialItem.material;
            materialsHTML += `
                <li class="list-group-item">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${material.name}</strong>
                            ${material.size ? `<br><small>Tamanho: ${material.size}</small>` : ''}
                        </div>
                        <div class="text-end">
                            <small>Quantidade: ${materialItem.selectedQuantity || 0}</small>
                            ${material.totalQuantity ? `<br><small>Total: ${material.totalQuantity}</small>` : ''}
                            <br><small class="badge ${material.reusable ? 'bg-success' : 'bg-warning'}">
                                ${material.reusable ? 'Reutilizável' : 'Descartável'}
                            </small>
                        </div>
                    </div>
                </li>
            `;
        });

        materialsHTML += `
                </ul>
            </div>
        `;

        const modalHTML = `
            <div class="modal fade" id="kitMaterialsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalhes do Kit</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${materialsHTML}
                        </div>

                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('kitMaterialsModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = new bootstrap.Modal(document.getElementById('kitMaterialsModal'));
        modal.show();
    }

    showNoResultsMessage(tbody) {
        const tr = tbody.insertRow();
        const td = tr.insertCell();
        td.colSpan = 7;
        td.textContent = 'Nenhuma reserva encontrada';
        td.className = 'text-center text-muted py-4';
    }

    showErrorMessage(message) {
        const tbody = document.querySelector('.table-custom tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        const tr = tbody.insertRow();
        const td = tr.insertCell();
        td.colSpan = 7;
        td.innerHTML = `
            <div class="text-center text-danger py-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
    }

    getStatusBadge(status) {
        let statusClass = '';
        let statusText = '';
        
        const statusUpper = status?.toUpperCase();
        
        switch (statusUpper) {
            case 'MARCADO':
                statusClass = 'status-pendente';
                statusText = 'Pendente';
                break;
            case 'CONCLUIDO':
            case 'CONCLUÍDO':
                statusClass = 'status-concluido';
                statusText = 'Concluído';
                break;
            default:
                statusClass = 'status-pendente';
                statusText = status || 'Pendente';
        }
        
        return `<span class="status-badge badge ${statusClass}">${statusText}</span>`;
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).replace(/\//g, '.');
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return dateString;
        }
    }

    applyFilters() {
        const statusFilters = this.getActiveStatusFilters();
        const labFilters = this.getActiveLabFilters();
        const dateFilters = this.getActiveDateFilters();

        console.log(' Aplicando filtros:', { statusFilters, labFilters, dateFilters });

        this.filteredReservations = this.reservations.filter(reservation => {
            const matchesStatus = this.matchesStatusFilter(reservation, statusFilters);
            const matchesLab = this.matchesLabFilter(reservation, labFilters);
            const matchesDate = this.matchesDateFilter(reservation, dateFilters);
            
            return matchesStatus && matchesLab && matchesDate;
        });

        console.log(` Resultado: ${this.filteredReservations.length} de ${this.reservations.length} reservas`);
        this.populateTable();
    }

    getActiveStatusFilters() {
        const statusDropdown = document.querySelector('.dropdown:nth-child(1) .dropdown-menu');
        if (!statusDropdown) return { todos: true, concluido: false, pendente: false };
        
        const checkboxes = statusDropdown.querySelectorAll('input[type="checkbox"]');
        
        return {
            todos: checkboxes[0]?.checked || false,
            concluido: checkboxes[1]?.checked || false,
            pendente: checkboxes[2]?.checked || false
        };
    }

    getActiveLabFilters() {
        const labDropdown = document.querySelector('.dropdown:nth-child(2) .dropdown-menu');
        if (!labDropdown) return { todos: true };
        
        const checkboxes = labDropdown.querySelectorAll('input[type="checkbox"]');
        const filters = { todos: checkboxes[0]?.checked || false };
     
        for (let i = 1; i < checkboxes.length; i++) {
            const checkbox = checkboxes[i];
            const labName = checkbox.getAttribute('data-lab-name') || checkbox.nextElementSibling?.textContent?.trim();
            if (labName) {
                filters[labName] = checkbox.checked;
            }
        }
        
        return filters;
    }

    getActiveDateFilters() {
        const dateDropdown = document.querySelector('.dropdown:nth-child(3) .dropdown-menu');
        if (!dateDropdown) return { todos: true, ultimos7dias: false, ultimos30dias: false, ultimos90dias: false };
        
        const checkboxes = dateDropdown.querySelectorAll('input[type="checkbox"]');
        
        return {
            todos: checkboxes[0]?.checked || false,
            ultimos7dias: checkboxes[1]?.checked || false,
            ultimos30dias: checkboxes[2]?.checked || false,
            ultimos90dias: checkboxes[3]?.checked || false
        };
    }

    matchesStatusFilter(reservation, filters) {
        if (filters.todos) return true;
        
        const status = reservation.status?.toUpperCase();
        
        if (filters.concluido && (status === 'CONCLUIDO' || status === 'CONCLUÍDO')) return true;
        if (filters.pendente && status === 'MARCADO') return true;
        
        return false;
    }

    matchesLabFilter(reservation, filters) {
        if (filters.todos) return true;
        
        const labName = reservation.labName;
        if (!labName) return false;
        
        for (const [filterLabName, isActive] of Object.entries(filters)) {
            if (filterLabName !== 'todos' && isActive && filterLabName === labName) {
                return true;
            }
        }
        
        return false;
    }

    matchesDateFilter(reservation, filters) {
        if (filters.todos) return true;
        if (!reservation.date) return false;
        
        const reservationDate = new Date(reservation.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (filters.ultimos7dias) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);
            
            return reservationDate >= sevenDaysAgo && reservationDate <= today;
        }
        
        if (filters.ultimos30dias) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            thirtyDaysAgo.setHours(0, 0, 0, 0);
            
            return reservationDate >= thirtyDaysAgo && reservationDate <= today;
        }
        
        if (filters.ultimos90dias) {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(today.getDate() - 90);
            ninetyDaysAgo.setHours(0, 0, 0, 0);
            
            return reservationDate >= ninetyDaysAgo && reservationDate <= today;
        }
        
        return false;
    }

    handleUnauthorized() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'login.html';
    }

    refresh() {
        this.loadReservations();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Usuário não autenticado. Redirecionando para login...');
        window.location.href = 'login.html';
        return;
    }

    window.reservationsManager = new ReservationsManager();
});

window.refreshReservations = function() {
    if (window.reservationsManager) {
        window.reservationsManager.refresh();
    }
};