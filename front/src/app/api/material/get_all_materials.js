async function getAllMaterials() {
    try{
        const response = await axios.get(
            `http://localhost:3000/api/materials`,
            {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmJlZTkyNWY4ZmIxOGRiY2U4ZWNiOSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc2NDAzMTk2OSwiaWF0IjoxNzYzOTQ1NTY5fQ.RwNN8zCLe0lVTfneotEsmStHgktVK_CffYfGwQYRxrU`
                }
            } 
        );
        console.log("Resposta da API:");
        console.log(response.data.material);
        return response.data;
    }
    catch (error) {
        console.error("Erro ao obter materiais: ", error);
    }
}