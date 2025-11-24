 async function updateKit(kitId, kitData) {
    
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
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
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