async function getAllKits() {
    try{
        const response = await axios.get(
            `http://localhost:3000/api/kits`,
            {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmJlZTkyNWY4ZmIxOGRiY2U4ZWNiOSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc2Mzk5NzE1OSwiaWF0IjoxNzYzOTEwNzU5fQ.t4i511YXhiG-yS-JGNoIpTHyo7oKx9iUMJhrf0Jekls`
                }
            } 
        );
        console.log("Resposta da API:");
        console.log(response.data.material);
        return response.data;
    }
    catch (error) {
        console.error("Erro ao obter kits: ", error);
    }
}