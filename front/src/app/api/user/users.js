class User {
    constructor() {
        this.id = 1;
        this.arrayUsuarios = [];
        this.isLoading = false; 
        this.setupModalListeners();
        this.setupEventListeners();
        this.checkAuthentication();
   
    }

    checkAuthentication() {
        const token = this.getToken();
        if (!token) {
            alert('Usuário não autenticado. Redirecionando para login...');
            window.location.href = 'login.html';
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
            console.log('⏳ Save já em andamento...');
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
                    console.log('📧 Email ajustado para:', user.email);
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
                alert('Usuário criado com sucesso!');
                
            } catch (error) {
                console.error('❌ ERRO NO SAVE:', error);
                alert('Erro ao criar usuário: ' + error.message);
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
        // Atualizado para incluir MODERATOR
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
            console.log('🔄 Enviando para API:', user);
            
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });

            console.log('📨 Status da resposta:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erro da API:', errorText);
                
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
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'login.html';
    }

    addUser(user) {
        user.id = this.id;
        this.arrayUsuarios.push(user);
        this.id++;
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

            let tr = tbody.insertRow();
            
            // Atualizado para incluir MODERATOR
            let roleValue = user.role === 'PROFESSOR' ? 'prof' : 
                          user.role === 'MODERATOR' ? 'mod' : 'adm';
            tr.setAttribute('data-role', roleValue);

            let td_nome = tr.insertCell();
            let td_email = tr.insertCell();
            let td_cargo = tr.insertCell();

            td_nome.innerText = user.name;
            td_email.innerText = user.email;
            
            // Atualizado para incluir MODERATOR
            let cargoDisplay = user.role === 'PROFESSOR' ? 'Professor' : 
                             user.role === 'MODERATOR' ? 'Técnico' : 'Administrador';
            
            let badgeClass = user.role === 'PROFESSOR' ? 'badge-professor' : 
                           user.role === 'MODERATOR' ? 'badge-moderator' : 'badge-admin';
            
            td_cargo.innerHTML = `<span class="badge ${badgeClass}">${cargoDisplay}</span>`;
        }

      
        this.applyActiveFilters();
    }

    validaUsuario(user) {
        console.log('🔍 Validando usuário:', user);
        
        if (user.name == '' || user.email == '' || user.role == '' || user.password == '') {
            alert('Preencha todos os campos!');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@etec\.br$/;
        if (!emailRegex.test(user.email.toLowerCase())) {
            alert('Use apenas emails com domínio @etec.br (exemplo: usuario@etec.br)');
            return false;
        }
        
        if (user.password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return false;
        }
        
        console.log('✅ Validação passou');
        return true;
    }

    clearForm() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('role').value = '';
        
        // Remover classes de validação
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
        const modCheckbox = document.getElementById('filter-mod'); // Novo filtro para MODERATOR

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
        const modCheckbox = document.getElementById('filter-mod'); // Novo filtro para MODERATOR
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

    async loadUsersFromAPI() {
       
        if (this.isLoading) {
            console.log('⏳ Carregamento já em andamento...');
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
            console.log('🔄 Carregando usuários de:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📨 Status da resposta:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Dados recebidos:', data);
                
                if (data.users && Array.isArray(data.users)) {
                    this.arrayUsuarios = data.users;
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
        window.location.href = 'login.html';
    }

    displayUserInfo() {
        const user = this.getCurrentUser();
        const userInfoElement = document.getElementById('userInfo');
        
        if (userInfoElement && user) {
            // Atualizado para incluir MODERATOR
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
        window.location.href = 'index.html';
    }
    catch (error) {
        console.error(' Erro ao autenticar usuário:', error);
        alert('Erro ao fazer login. Verifique suas credenciais.');
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