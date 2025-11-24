async function authUser(event) {
  event.preventDefault();
    const response = await axios.post(
      `http://localhost:3000/api/login`,
      {
        "email": document.querySelector('#emailInput').value,
        "password": document.querySelector('#passwordInput').value
      }
    );
    console.log('Resposta da API:')
    console.log(response.data)

    localStorage.setItem('token', JSON.stringify(response.data.token))

    localStorage.setItem('user', JSON.stringify(response.data.user))
  }