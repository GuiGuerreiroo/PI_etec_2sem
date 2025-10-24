
async function getLaboratoryStatus(date) {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/lab-status?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      }
    );
    return response.data;
  }
  catch(error) {
    console.error('Erro ao buscar laboratórios:', error);
    throw error;
  }
}


if (typeof window !== 'undefined') {
  window.getLaboratoryStatus = getLaboratoryStatus;
}