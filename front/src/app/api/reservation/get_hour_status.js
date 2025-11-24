async function getHourStatus(date, labId) {
    console.log("entrei")
    try {
        const response = await axios.get(
            `http://localhost:3000/api/hours-status?date=${date}&labId=${labId}`,
            { 
              headers: {
                  Authorization:  `Bearer ${JSON.parse(localStorage.getItem('token'))}`
              }
            }
        );
        return response.data;
    }
    catch(error) {
        console.error('Erro ao buscar status dos horários: ', error);
    }
}  

