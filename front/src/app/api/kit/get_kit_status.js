async function getKitStatus(date, hour) {
    try {
        const response = await axios.get(
            `http://localhost:3000/api/kit-status?date=${date}&hour=${hour}`,
            { 
              headers: {
                  Authorization:  `Bearer ${JSON.parse(localStorage.getItem('token'))}`
              }
            }
        );
        return response.data;
    }
    catch(error) {
        console.error('Erro ao buscar status dos kits: ', error);
    }
}  
