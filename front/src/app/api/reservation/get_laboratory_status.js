// async function getLaboratory() {
//   try{
//     const date= "2025-11-15"

//     const response = await axios.get(
//       `http://localhost:3000/api/lab-status?date=${date}`,
//       {
//         headers: {
//             Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
//         }
//       }
//     );
//     console.log(response.data)
//   }
//   catch(error){
//     console.error('Erro ao autenticar usuário:', error);
//   }
// }