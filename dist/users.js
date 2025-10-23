class User {

        constructor(){
            this.id = 1;
            this.arrayUsuarios = []
        }


        save(){
         
            let user = this.readData();

            if(this.validaUsuario(user)){
                this.addUser(user)
                this.tableList()
            }

            
        }
        
        readData(){
            let user = {}

            user.id = this.id
            user.nameUser = document.getElementById('nome').value;
            user.passwordUser = document.getElementById('senha').value;
            user.emailUser = document.getElementById('email').value;
            user.roleUser = document.getElementById('cargo').value;

            return user;

        }


        addUser(user){
            this.arrayUsuarios.push(user);
            this.id++;
           

        }



        tableList(){
            let tbody = document.getElementById('tbody');
            tbody.innerHTML = ''; 

           
            for(let i = 0; i < this.arrayUsuarios.length; i++){
                let user = this.arrayUsuarios[i]; 

                let tr = tbody.insertRow();
                
               
                tr.setAttribute('data-role', user.roleUser); 

                let td_nome = tr.insertCell() 
                let td_email = tr.insertCell() 
                let td_cargo = tr.insertCell() 

                td_nome.innerText = user.nameUser
                td_email.innerText = user.emailUser // 
                
                let cargoDisplay = user.roleUser === 'prof' ? 'Professor' : 'Administrador';
                let badgeClass = user.roleUser === 'prof' ? 'bg-primary' : 'bg-success';
             
                let cargoBadge = user.roleUser.toUpperCase();
                td_cargo.innerHTML = `<span class="badge cargo-badge">${cargoBadge}</span>`;
            }
        }

        validaUsuario(user){
        if(user.nameUser == '' || user.emailUser == '' || user.roleUser == ''){
            alert('Preencha todos os campos!');
            return false;
        }
        return true;
    }

        filterTable() {
                
                const allCheckbox = document.getElementById('filter-all');
                const profCheckbox = document.getElementById('filter-prof');
                const admCheckbox = document.getElementById('filter-adm');

           
                if (allCheckbox.checked) {
                    profCheckbox.checked = false;
                    admCheckbox.checked = false;
                } 
               
                else if (profCheckbox.checked || admCheckbox.checked) {
                    allCheckbox.checked = false;
                } 
              
                else if (!profCheckbox.checked && !admCheckbox.checked) {
                    allCheckbox.checked = true;
                }
                
              
                let activeFilters = [];
                
                if (allCheckbox.checked) {
                    activeFilters = ['prof', 'adm']; 
                } else {
                    if (profCheckbox.checked) {
                        activeFilters.push('prof');
                    }
                    if (admCheckbox.checked) {
                        activeFilters.push('adm');
                    }
                }
                
                const tbody = document.getElementById('tbody');
                const rows = tbody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const role = row.getAttribute('data-role');
                    
                    
                    if (activeFilters.length === 0 || activeFilters.includes(role)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
}




var user = new User()