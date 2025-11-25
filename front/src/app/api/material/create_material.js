async function createMaterial(name, reusable, totalQuantity, size) {
    try {
        const body = {
            name: name,
            reusable: reusable,
            totalQuantity: totalQuantity
        };

        if (size) body.size = size;

        const response = await axios.post(
            `http://localhost:3000/api/material`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            }
        );
        console.log("Resposta da API:");
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error("Erro ao criar material: ", error);
    }
}