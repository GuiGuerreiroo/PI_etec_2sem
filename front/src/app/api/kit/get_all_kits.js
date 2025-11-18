async function getAllKits() {
    try{
        const response = await axios.get(
            `http://localhost:3000/api/kits`,
            {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmU3MGRhNjc0YzM0NGQwZjE3ZDIwNiIsInJvbGUiOiJQUk9GRVNTT1IiLCJleHAiOjE3NjM1NzcyNzUsImlhdCI6MTc2MzQ5MDg3NX0.qjc0BZ2bUopqNm2qvNS_cDQrbunPeNcnD7qjIE_fe34`
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