async function userDirection(event){
    try{
        await authUser(event);
    
        const user = JSON.parse(localStorage.getItem('user'));
    
        if (user.role === 'ADMIN') {
            window.location.href = '../pages/reservation.html';
        }
    }
    catch(error){
        console.error('Erro na autenticação do usuário:', error);
    }
}