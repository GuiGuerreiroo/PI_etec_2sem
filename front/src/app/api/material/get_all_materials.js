async function getAllMaterials() {
    try{
        const response = await axios.get(
            `http://localhost:3000/api/materials`,
            {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmJlZTkyNWY4ZmIxOGRiY2U4ZWNiOSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc2MzQxMzc3OSwiaWF0IjoxNzYzMzI3Mzc5fQ.C-wLBhZBBBpRgx6oNJWYJ8WHmCsN7_5V8m_bHwYG4ro`
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