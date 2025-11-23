 async function updateKit(kitId, kitData) {
    const token = localStorage.getItem('token') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmJlZTkyNWY4ZmIxOGRiY2U4ZWNiOSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc2Mzk5NzE1OSwiaWF0IjoxNzYzOTEwNzU5fQ.t4i511YXhiG-yS-JGNoIpTHyo7oKx9iUMJhrf0Jekls";
    try {
        const body = {
            id: kitId
        };

        if (kitData.name) body.name = kitData.name;
        if (kitData.materials) body.materials = kitData.materials;
            
        const response = await axios.put(
            `http://localhost:3000/api/kit`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Resposta da API:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar kit:", error);
        throw error;
    }
}