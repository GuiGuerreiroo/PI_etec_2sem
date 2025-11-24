async function getAllMaterials() {
    try{
        const response = await axios.get(
            `http://localhost:3000/api/materials`,
            {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmJlZTkyNWY4ZmIxOGRiY2U4ZWNiOSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc2NDAyNDI4MywiaWF0IjoxNzYzOTM3ODgzfQ.b5G58OO_Jd3eTklm-t4pB4fI6GWOWkOp99J5kB2coXc`
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