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

// Clear localStorage when login page loads to prevent using old credentials
function clearAuthData() {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
}

// Call this when the page loads
window.addEventListener('DOMContentLoaded', () => {
    clearAuthData();
});

async function userDirection(event) {
    event.preventDefault();

    // Get input values
    const email = document.querySelector('#emailInput').value.trim();
    const password = document.querySelector('#passwordInput').value.trim();

    // Validate empty fields
    if (!email) {
        showToast('Por favor, preencha o campo de email', 'error');
        return;
    }

    if (!password) {
        showToast('Por favor, preencha o campo de senha', 'error');
        return;
    }

    try {
        await authUser(event);

        showToast('Login realizado com sucesso!', 'success');

        const user = JSON.parse(localStorage.getItem('user'));

        setTimeout(() => {
            if (user.role === 'PROFESSOR' || user.role === 'ADMIN' || user.role === 'MODERATOR') {
                window.location.href = '../pages/home.html';
            }
        }, 1000);
    }
    catch (error) {
        console.error('Erro na autenticação do usuário:', error);

        // Handle different error types
        if (error.response) {
            // Server responded with error
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error;

            if (status === 401 || status === 404) {
                showToast(message || 'E-mail ou senha incorretos', 'error');
            } else if (status === 400) {
                showToast(message || 'Dados inválidos. Verifique os campos', 'error');
            } else {
                showToast('Erro ao fazer login. Tente novamente', 'error');
            }
            
        } else if (error.request) {
            // Request made but no response
            showToast('Erro de conexão. Verifique sua internet', 'error');
        } else {
            // Something else happened
            showToast('Erro inesperado. Tente novamente', 'error');
        }
    }
}