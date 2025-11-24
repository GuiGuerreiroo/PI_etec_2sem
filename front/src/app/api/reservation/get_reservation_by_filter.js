async function getReservationByFilter(date) {
  try {
    const response = await axios.get(`http://localhost:3000/api/reservation?date=${date}&status=MARCADO`, 
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      }
    );
    console.log(response);

    if (response.status === 401 && response.data.error === "Invalid token: expired") {
      // Se o token estiver expirado, redireciona para a página de login
      window.location.href = '../pages/login.html';
      return;
    }

    return response.data;
  }
  catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
}