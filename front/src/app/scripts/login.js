async function userDirection(event){
    try{
        await authUser(event);
    
        const user = JSON.parse(localStorage.getItem('user'));
    
        if (user.role === 'PROFESSOR' || user.role === 'ADMIN' || user.role === 'MODERATOR'){ 
            window.location.href = '../pages/home.html';
        }
    }
    catch(error){
        console.error('Erro na autenticação do usuário:', error);
    }
}