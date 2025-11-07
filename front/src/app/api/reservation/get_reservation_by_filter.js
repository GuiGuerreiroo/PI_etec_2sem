async function getReservationByFilter(date) {
  try {
    /*function isValidYMD(s) {
      if (typeof s !== 'string') return false;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
      const [y, m, d] = s.split('-').map(Number);
      const dt = new Date(s);
      return dt.getFullYear() === y && dt.getMonth() + 1 === m && dt.getDate() === d;
    }//*/

    /*if (filter.date) {
      const dateObj = new Date(filter.date);
      if (!isNaN(dateObj.getTime())) {
        params.date = dateObj.toISOString().slice(0, 10);
      }
    }
    if (filter.hour) params.hour = filter.hour;
    if (filter.idLab) params.idLab = filter.idLab;
    if (filter.idUser) params.idUser = filter.idUser;
    if (filter.status) params.status = filter.status;
    //*/
    const user = localStorage.getItem('user');
    const userId = JSON.parse(user).id;
    console.log('User ID:', userId);
    const response = await axios.get(`http://localhost:3000/api/reservation?date=${date}&status=MARCADO&userId=${userId}`
      , {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      }
    );
    console.log(response);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
}