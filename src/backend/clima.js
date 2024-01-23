const axios = require('axios');

const ACCUWEATHER_API_KEY = 'y8xWsCFyDQQfjZ7BeoAWJbYCo7Y3tqWY'; // Reemplaza con tu clave de API de AccuWeather

async function obtenerDatosClima(ciudad) {
  try {
    const response = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/1day?apikey=${ACCUWEATHER_API_KEY}&q=${ciudad}&metric=true`);
    return response.data;
    console.log("Datos del clima leídos");
  } catch (error) {
    throw error;
  }
}

module.exports = {
  obtenerDatosClima,
};
