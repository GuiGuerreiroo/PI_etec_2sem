async function createKit(materialBody, name) {
    try {
        const response = await axios.post(
            `http://localhost:3000/api/create-kit`,

            {
                "name": name,
                "material": materialBody,
            },
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            }
        );
        console.log("Resposta da API:");
        console.log(response.data);
        localStorage.setItem("kit", JSON.stringify(response.data));
        localStorage.setItem("kitId", JSON.stringify(response.data.kitId));
    }
    catch (error) {
        console.error("Erro ao criar kit: ", error);
    }
}

// materialBody= [
//     {
//         "selectedQuantity": 10,
//         "materialId": '1'
//     },
//     {
//        "selectedQuantity": 20,
//         "materialId": '2'
//     }

// ]