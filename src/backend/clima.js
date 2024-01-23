const axios = require('axios');
const fs = require('fs');

const ACCUWEATHER_API_KEY = 'y8xWsCFyDQQfjZ7BeoAWJbYCo7Y3tqWY';

async function obtenerDatosClima(ciudad) {
  try {
    console.log('Intentando obtener datos del clima para la ciudad:', ciudad);
    const response = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${ciudad}?apikey=${ACCUWEATHER_API_KEY}&metric=true`);
    const datosClima = response.data;

    // Convertir a formato JSON
    const datosClimaJSON = JSON.stringify(datosClima, null, 2);

    // Guardar en un archivo
    fs.writeFileSync('clima.json', datosClimaJSON);

    console.log('Datos del clima leídos y guardados en clima.json:', datosClima);
    return datosClima;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  obtenerDatosClima,
};
