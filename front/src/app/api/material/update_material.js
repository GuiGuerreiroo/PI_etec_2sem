async function updateMaterial(materialId, materialData) {

    try {
        const body = {
            id: materialId
        };

        if (materialData.reusable) body.reusable = materialData.reusable;
        if (materialData.totalQuantity) body.totalQuantity = materialData.totalQuantity;

        const response = await axios.put(
            `http://localhost:3000/api/material`,
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
        console.error("Erro ao atualizar material:", error);
        throw error;
    }
}