async function getAllKits() {
    try{
        const response = await axios.get(
            `http://localhost:3000/api/kits`,
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            } 
        );
        console.log("Resposta da API:");
        console.log(response.data.kits);
        return response.data;
    }
    catch (error) {
        console.error("Erro ao obter kits: ", error);
    }
}