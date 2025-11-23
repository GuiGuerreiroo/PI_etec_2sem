class User {
    constructor() {
        this.id = 1;
        this.arrayUsuarios = [];
        this.isLoading = false; 
        this.setupModalListeners();
        this.setupEventListeners();
        this.checkAuthentication();
        this.currentUser = this.getCurrentUser();
        this.setupToastContainer();
    }

    setupToastContainer() {
        if (!document.getElementById('toastContainer')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }
    }

    showToast(message, type = 'success') {
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

    async showConfirmation(message) {
        return new Promise((resolve) => {
            const modalId = 'confirmModal-' + Date.now();
            const modalHTML = `
                <div class="modal fade" id="${modalId}" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Confirmação</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-question-circle text-warning me-3 fs-4"></i>
                                    <div>${message}</div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-danger" id="confirmButton">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modalElement = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalElement);

            document.getElementById('confirmButton').addEventListener('click', () => {
                modal.hide();
                resolve(true);
            });

            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                resolve(false);
            });

            modal.show();
        });
    }

    checkAuthentication() {
        const token = this.getToken();
        if (!token) {
            this.showToast('Usuário não autenticado. Redirecionando para login...', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
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

    getCurrentUser() {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    setupModalListeners() {
        const modal = document.getElementById('createUserModal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', () => {
                this.clearForm();
            });
            
            modal.addEventListener('shown.bs.modal', () => {
                this.setupEmailValidation();
            });
        }
    }

    setupEmailValidation() {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.placeholder = "usuario@etec.br";
            
            emailInput.addEventListener('blur', () => {
                this.validateEmailFormat(emailInput.value);
            });
        }
    }

    setupEventListeners() {
        const salvarBtn = document.getElementById('salvarBtn');
        if (salvarBtn) {
            salvarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.save();
            });
        }

        document.querySelectorAll('.dropdown-menu input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                this.filterTable(e);
            });
        });

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTable(e);
            });
        }
    }
    
    validateEmailFormat(email) {
        if (!email) return true;
        
        const isValid = email.toLowerCase().endsWith('@etec.br');
        
        const emailInput = document.getElementById('email');
        if (emailInput) {
            if (!isValid && email.includes('@')) {
                emailInput.classList.add('is-invalid');
                this.showEmailHelp('Apenas emails com domínio @etec.br são aceitos');
                return false;
            } else {
                emailInput.classList.remove('is-invalid');
                this.hideEmailHelp();
                return true;
            }
        }
        return isValid;
    }

    showEmailHelp(message) {
        let helpElement = document.getElementById('emailHelp');
        if (!helpElement) {
            const emailInput = document.getElementById('email');
            helpElement = document.createElement('div');
            helpElement.id = 'emailHelp';
            helpElement.className = 'invalid-feedback';
            emailInput.parentNode.appendChild(helpElement);
        }
        helpElement.textContent = message;
    }

    hideEmailHelp() {
        const helpElement = document.getElementById('emailHelp');
        if (helpElement) {
            helpElement.remove();
        }
    }

    async save() {
        if (this.isLoading) {
            console.log(' Save já em andamento...');
            return;
        }

        console.log('=== INICIANDO SAVE ===');
        
        let user = this.readData();
        console.log('Dados lidos:', user);

        if (this.validaUsuario(user)) {
            this.isLoading = true;
            
            try {
                if (!user.email.toLowerCase().endsWith('@etec.br')) {
                    const username = user.email.split('@')[0];
                    user.email = `${username}@etec.br`;
                    console.log(' Email ajustado para:', user.email);
                }

                const result = await this.sendToAPI(user);
                console.log('API respondeu com sucesso:', result);
                
                console.log(' Atualizando lista de usuários...');
                await this.loadUsersFromAPI();
                await new Promise(resolve => setTimeout(resolve, 100));
              
                const modalElement = document.getElementById('createUserModal');
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) {
                        modal.hide();
                    }
                }
                
                this.clearForm();
                this.showToast('Usuário criado com sucesso!', 'success');
               
                
            } catch (error) {
                console.error(' ERRO NO SAVE:', error);
                this.showToast('Erro ao criar usuário: ' + error.message, 'error');
            } finally {
                this.isLoading = false;
            }
        }
    }

    readData() {
        let user = {};

        user.name = document.getElementById('name').value;
        user.password = document.getElementById('password').value; 
        user.email = document.getElementById('email').value;
        
        const roleValue = document.getElementById('role').value;
        user.role = roleValue === 'PROFESSOR' ? 'PROFESSOR' : 
                   roleValue === 'MODERATOR' ? 'MODERATOR' : 'ADMIN';

        return user;
    }
    
    async sendToAPI(user) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Token de autenticação não encontrado. Faça login novamente.');
        }

        try {
            console.log(' Enviando para API:', user);
            
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });

            console.log('Status da resposta:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(' Erro da API:', errorText);
                
                let errorMessage = 'Erro ao criar usuário';
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.errors) {
                        errorMessage = errorData.errors;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (e) {
                    errorMessage = errorText;
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log(' Resposta da API:', result);
            return result;

        } catch (error) {
            console.error(' Erro na requisição fetch:', error);
            throw error;
        }
    }

    handleUnauthorized() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.showToast('Sessão expirada. Faça login novamente.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    addUser(user) {
        user.id = this.id;
        this.arrayUsuarios.push(user);
        this.id++;
    }

   
    shouldDisplayUser(user) {
        const currentUser = this.currentUser;
        
    
        if (currentUser.role === 'ADMIN') {
            return true;
        }
        
      
        if (currentUser.role === 'MODERATOR') {
            return user.role === 'PROFESSOR';
        }
        
       
        return false;
    }

    tableList() {
        let tbody = document.getElementById('tbody');
        if (!tbody) {
            console.error('Elemento tbody não encontrado');
            return;
        }
        
        tbody.innerHTML = '';

        for (let i = 0; i < this.arrayUsuarios.length; i++) {
            let user = this.arrayUsuarios[i];

            
            if (!this.shouldDisplayUser(user)) {
                continue;
            }

            let tr = tbody.insertRow();
            
         
            if (user.isDeleted) {
                tr.classList.add('user-deleted');
            }
            
            let roleValue = user.role === 'PROFESSOR' ? 'prof' : 
                          user.role === 'MODERATOR' ? 'mod' : 'adm';
            tr.setAttribute('data-role', roleValue);
            tr.setAttribute('data-user-id', user.id);
            tr.setAttribute('data-is-deleted', user.isDeleted);

            let td_nome = tr.insertCell();
            let td_email = tr.insertCell();
            let td_cargo = tr.insertCell();
            let td_status = tr.insertCell(); 
            let td_acoes = tr.insertCell();

            td_nome.innerText = user.name;
            td_email.innerText = user.email;
            
  
            if (user.isDeleted) {
                td_nome.style.textDecoration = 'line-through';
                td_email.style.textDecoration = 'line-through';
                td_nome.style.opacity = '0.6';
                td_email.style.opacity = '0.6';
            }
            
         
            if (user.isDeleted) {
                td_status.innerHTML = '<span class="badgeDesativado">Desativado</span>';
            } else {
                td_status.innerHTML = '<span class="badgeAtivo">Ativo</span>';
            }
            
            if (this.currentUser.role === 'ADMIN') {
                td_cargo.innerHTML = this.generateRoleDropdown(user);
            } else {
                let cargoDisplay = user.role === 'PROFESSOR' ? 'Professor' : 
                                 user.role === 'MODERATOR' ? 'Técnico' : 'Administrador';
                let badgeClass = user.role === 'PROFESSOR' ? 'badge-professor' : 
                               user.role === 'MODERATOR' ? 'badge-moderator' : 'badge-admin';
                
                // Adiciona classe para usuários desativados
                const disabledClass = user.isDeleted ? 'role-disabled' : '';
                
                td_cargo.innerHTML = `<span class="badge ${badgeClass} ${disabledClass}">${cargoDisplay}</span>`;
            }
            
            td_acoes.innerHTML = this.generateActionButtons(user);
        }

        this.applyActiveFilters();
        this.setupActionButtons();
        this.setupRoleDropdowns();
    }

    generateRoleDropdown(user) {
        const cargoDisplay = user.role === 'PROFESSOR' ? 'Professor' : 
                           user.role === 'MODERATOR' ? 'Técnico' : 'Administrador';
        const badgeClass = user.role === 'PROFESSOR' ? 'badge-professor' : 
                         user.role === 'MODERATOR' ? 'badge-moderator' : 'badge-admin';
        
        // Adiciona classe para usuários desativados
        const disabledClass = user.isDeleted ? 'role-disabled' : '';

        return `
            <div class="dropdown">
                <button class="btn btn-sm ${badgeClass} ${disabledClass} dropdown-toggle" type="button" 
                        data-bs-toggle="dropdown" aria-expanded="false"
                        ${user.isDeleted ? 'disabled' : ''}>
                    ${cargoDisplay}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item ${user.role === 'PROFESSOR' ? 'active' : ''}" 
                           href="#" data-role="PROFESSOR">Professor</a></li>
                    <li><a class="dropdown-item ${user.role === 'MODERATOR' ? 'active' : ''}" 
                           href="#" data-role="MODERATOR">Técnico</a></li>
                    <li><a class="dropdown-item ${user.role === 'ADMIN' ? 'active' : ''}" 
                           href="#" data-role="ADMIN">Administrador</a></li>
                </ul>
                <input type="hidden" class="user-id" value="${user.id}">
            </div>
        `;
    }

    setupRoleDropdowns() {
        document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const newRole = e.target.getAttribute('data-role');
                const userId = e.target.closest('.dropdown').querySelector('.user-id').value;
                this.updateUserRole(userId, newRole);
            });
        });
    }

    async updateUserRole(userId, newRole) {
        const user = this.arrayUsuarios.find(u => u.id === userId);
        if (!user) {
            this.showToast('Usuário não encontrado!', 'error');
            return;
        }

       
        if (this.currentUser.role !== 'ADMIN') {
            this.showToast('Você não tem permissão para alterar cargos!', 'warning');
            return;
        }

        if (userId === this.currentUser.id) {
            this.showToast('Você não pode alterar seu próprio cargo!', 'warning');
            return;
        }

        if (user.isDeleted) {
            this.showToast('Não é possível alterar cargo de usuário desativado!', 'warning');
            return;
        }

        if (user.role === newRole) {
            return;
        }

        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const token = this.getToken();
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: userId,
                    role: newRole
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao atualizar cargo');
            }

            const result = await response.json();
            console.log('Cargo atualizado:', result);

            user.role = newRole;
            this.updateTableRow(userId, newRole);
            this.showToast('Cargo atualizado com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao atualizar cargo:', error);
            this.showToast('Erro ao atualizar cargo: ' + error.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    updateTableRow(userId, newRole) {
        const row = document.querySelector(`tr[data-user-id="${userId}"]`);
        if (!row) return;

        const cargoCell = row.cells[2];
        const user = this.arrayUsuarios.find(u => u.id === userId);
        
        if (this.currentUser.role === 'ADMIN') {
            cargoCell.innerHTML = this.generateRoleDropdown(user);
            this.setupRoleDropdowns();
        } else {
            const cargoDisplay = newRole === 'PROFESSOR' ? 'Professor' : 
                               newRole === 'MODERATOR' ? 'Técnico' : 'Administrador';
            const badgeClass = newRole === 'PROFESSOR' ? 'badge-professor' : 
                             newRole === 'MODERATOR' ? 'badge-moderator' : 'badge-admin';
            const disabledClass = user.isDeleted ? 'role-disabled' : '';
            cargoCell.innerHTML = `<span class="badge ${badgeClass} ${disabledClass}">${cargoDisplay}</span>`;
        }
    }

    generateActionButtons(user) {
        const currentUser = this.currentUser;
        
        if (currentUser.role === 'PROFESSOR') {
            return '<span class="text-muted">-</span>';
        }
        
       
        if (user.isDeleted) {
            if (currentUser.role === 'MODERATOR' && user.role === 'PROFESSOR') {
               
                return `
                    <button class="btn btn-outline-success btn-sm" data-action="reactivate" data-user-id="${user.id}" title="Reativar usuário">
                        <i class="fas fa-undo"></i>
                    </button>
                `;
            } else if (currentUser.role === 'ADMIN') {
           
                return `
                    <button class="btn btn-outline-success btn-sm" data-action="reactivate" data-user-id="${user.id}" title="Reativar usuário">
                        <i class="fas fa-undo"></i>
                    </button>
                `;
            }
            return '<span class="text-muted">-</span>';
        }
        

        if (currentUser.role === 'MODERATOR') {
            if (user.role === 'PROFESSOR') {
                return `
                    <button class="btn btn-outline-danger btn-sm" data-action="delete" data-user-id="${user.id}" title="Desativar usuário">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
            }
            return '<span class="text-muted">-</span>';
        }
        
        if (currentUser.role === 'ADMIN') {
            if (user.id !== currentUser.id) {
                return `
                    <button class="btn btn-outline-danger btn-sm" data-action="delete" data-user-id="${user.id}" title="Desativar usuário">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
            } else {
                return '<span class="text-muted">-</span>';
            }
        }
        
        return '';
    }

    setupActionButtons() {

        document.querySelectorAll('[data-action="delete"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.closest('button').getAttribute('data-user-id');
                this.confirmDeleteUser(userId);
            });
        });
        
    
        document.querySelectorAll('[data-action="reactivate"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.closest('button').getAttribute('data-user-id');
                this.confirmReactivateUser(userId);
            });
        });
    }


    async confirmDeleteUser(userId) {
        const user = this.arrayUsuarios.find(u => u.id === userId);
        if (!user) return;

        const confirmDelete = await this.showConfirmation(
            `Tem certeza que deseja desativar o usuário "<strong>${user.name}</strong>" (${user.email})?`
        );
        
        if (confirmDelete) {
            await this.softDeleteUser(userId);
        }
    }


    async softDeleteUser(userId) {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const token = this.getToken();
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: userId
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao desativar usuário');
            }

            const result = await response.json();
            console.log('Usuário desativado:', result);

            await this.loadUsersFromAPI();
            this.showToast('Usuário desativado com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao desativar usuário:', error);
            this.showToast('Erro ao desativar usuário: ' + error.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }


    async confirmReactivateUser(userId) {
        const user = this.arrayUsuarios.find(u => u.id === userId);
        if (!user) return;

        const confirmReactivate = await this.showConfirmation(
            `Tem certeza que deseja reativar o usuário "<strong>${user.name}</strong>" (${user.email})?`
        );
        
        if (confirmReactivate) {
            await this.reactivateUser(userId);
        }
    }

 
    async reactivateUser(userId) {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const token = this.getToken();
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: userId,
                    isDeleted: false
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao reativar usuário');
            }

            const result = await response.json();
            console.log('Usuário reativado:', result);

            await this.loadUsersFromAPI();
            this.showToast('Usuário reativado com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao reativar usuário:', error);
            this.showToast('Erro ao reativar usuário: ' + error.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    validaUsuario(user) {
        console.log('🔍 Validando usuário:', user);
        
        if (user.name == '' || user.email == '' || user.role == '' || user.password == '') {
            this.showToast('Preencha todos os campos!', 'warning');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@etec\.br$/;
        if (!emailRegex.test(user.email.toLowerCase())) {
            this.showToast('Use apenas emails com domínio @etec.br (exemplo: usuario@etec.br)', 'warning');
            return false;
        }
        
        if (user.password.length < 6) {
            this.showToast('A senha deve ter pelo menos 6 caracteres!', 'warning');
            return false;
        }
        
        console.log(' Validação passou');
        return true;
    }

    clearForm() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('role').value = '';
        
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.classList.remove('is-invalid');
        }
        this.hideEmailHelp();
    }

    filterTable(event = null) {
        if (event) {
            event.stopPropagation();
        }

        const allCheckbox = document.getElementById('filter-all');
        const profCheckbox = document.getElementById('filter-prof');
        const admCheckbox = document.getElementById('filter-adm');
        const modCheckbox = document.getElementById('filter-mod');

        if (!allCheckbox || !profCheckbox || !admCheckbox || !modCheckbox) {
            console.warn('Elementos de filtro não encontrados');
            return;
        }

        if (event && event.target) {
            const clickedCheckbox = event.target;

            if (clickedCheckbox === allCheckbox && allCheckbox.checked) {
                profCheckbox.checked = false;
                admCheckbox.checked = false;
                modCheckbox.checked = false;
            } else if (clickedCheckbox === profCheckbox || clickedCheckbox === admCheckbox || clickedCheckbox === modCheckbox) {
                allCheckbox.checked = false;
            }

            if (!profCheckbox.checked && !admCheckbox.checked && !modCheckbox.checked) {
                allCheckbox.checked = true;
            }
        }

        this.applyActiveFilters();
    }

    applyActiveFilters() {
        const allCheckbox = document.getElementById('filter-all');
        const profCheckbox = document.getElementById('filter-prof');
        const admCheckbox = document.getElementById('filter-adm');
        const modCheckbox = document.getElementById('filter-mod');
        const searchInput = document.getElementById('searchInput');

        if (!allCheckbox || !profCheckbox || !admCheckbox || !modCheckbox) {
            return;
        }

        let activeFilters = [];
        
        if (allCheckbox.checked) {
            activeFilters = ['prof', 'adm', 'mod'];
        } else {
            if (profCheckbox.checked) activeFilters.push('prof');
            if (admCheckbox.checked) activeFilters.push('adm');
            if (modCheckbox.checked) activeFilters.push('mod');
        }

        const tbody = document.getElementById('tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        let visibleCount = 0;
        
        rows.forEach(row => {
            const role = row.getAttribute('data-role');
            const name = row.cells[0].textContent.toLowerCase();
            const email = row.cells[1].textContent.toLowerCase();
            
            const matchesFilter = activeFilters.includes(role);
            const matchesSearch = !searchTerm || 
                                name.includes(searchTerm) || 
                                email.includes(searchTerm);
            
            if (matchesFilter && matchesSearch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        if (visibleCount === 0 && rows.length > 0) {
            this.showNoResultsMessage();
        } else {
            this.hideNoResultsMessage();
        }
    }

    showNoResultsMessage() {
        console.log('Nenhum usuário encontrado com os filtros selecionados');
    }

    hideNoResultsMessage() {
       
    }

    ensureIsDeletedField() {
        this.arrayUsuarios = this.arrayUsuarios.map(user => {
       
            if (user.isDeleted === undefined) {
                user.isDeleted = false;
            }
            return user;
        });
    }

    async loadUsersFromAPI() {
        if (this.isLoading) {
            console.log(' Carregamento já em andamento...');
            return;
        }

        const token = this.getToken();
        if (!token) {
            console.error('Token não disponível para carregar usuários');
            return;
        }

        this.isLoading = true;

        try {
            const url = 'http://localhost:3000/api/users';
            console.log(' Carregando usuários de:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(' Status da resposta:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log(' Dados recebidos:', data);
                
                if (data.users && Array.isArray(data.users)) {
                    this.arrayUsuarios = data.users;
                    
               
                    this.ensureIsDeletedField();
                    
                    this.tableList();
                    console.log(' Usuários carregados com sucesso:', this.arrayUsuarios.length);
                } else {
                    console.error(' Formato de dados inválido:', data);
                    this.arrayUsuarios = [];
                }
                
            } else if (response.status === 401) {
                console.log(' Não autorizado - redirecionando para login');
                this.handleUnauthorized();
            } else {
                const errorText = await response.text();
                console.error(' Erro ao carregar usuários:', response.status, errorText);
                this.arrayUsuarios = [];
            }
        } catch (error) {
            console.error(' Erro ao carregar usuários:', error);
            this.arrayUsuarios = [];
        } finally {
            this.isLoading = false;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.showToast('Logout realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }

    displayUserInfo() {
        const user = this.getCurrentUser();
        const userInfoElement = document.getElementById('userInfo');
        
        if (userInfoElement && user) {
            const roleDisplay = user.role === 'PROFESSOR' ? 'Professor' : 
                              user.role === 'MODERATOR' ? 'Técnico' : 'Administrador';
            userInfoElement.textContent = `${user.name} (${roleDisplay})`;
        }
    }
}

async function authUser(event) {
    event.preventDefault();
    
    const email = document.querySelector('#emailInput').value;
    const password = document.querySelector('#passwordInput').value;
    
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email.toLowerCase().trim(),
                "password": password
            })
        });

        if (!response.ok) {
            throw new Error('Erro na autenticação');
        }

        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        console.log(' Login realizado com sucesso:', data);
        
        if (user && user.showToast) {
            user.showToast('Login realizado com sucesso!', 'success');
        }
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    }
    catch (error) {
        console.error(' Erro ao autenticar usuário:', error);
        if (user && user.showToast) {
            user.showToast('Erro ao fazer login. Verifique suas credenciais.', 'error');
        }
    }
}

var user = null;

document.addEventListener('DOMContentLoaded', function() {
    if (!user) {
        user = new User();
    }
    
    if (document.getElementById('tbody')) {
        if (user.arrayUsuarios.length === 0 && !user.isLoading) {
            user.loadUsersFromAPI();
        } 
        user.displayUserInfo();
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', authUser);
    }
});