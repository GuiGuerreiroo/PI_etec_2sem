async function getAllMaterials() {
    try{
        const response = await axios.get(
            `http://localhost:3000/api/materials?t=${new Date().getTime()}`,
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            } 
        );
        console.log("Resposta da API:");
        console.log(response.data.materials);
        return response.data;
    }
    catch (error) {
        console.error("Erro ao obter materiais: ", error);
    }
}