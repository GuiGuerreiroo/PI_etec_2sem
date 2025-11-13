async function createMaterial(name, reusable, totalQuantity) {
    try {
        const response = await axios.post(
            `http://localhost:3000/api/create-material`,

            {
                "name": name,
                "reusable": reusable,
                "totalQuantity": totalQuantity,
            },
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            }
        );
        console.log("Resposta da API:");
        console.log(response.data);
        localStorage.setItem("material", JSON.stringify(response.data));
        localStorage.setItem("materialId", JSON.stringify(response.data.materialId));
    }
    catch (error) {
        console.error("Erro ao criar material: ", error);
    }
}