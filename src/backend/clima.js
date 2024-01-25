const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ACCUWEATHER_API_KEY = 'y8xWsCFyDQQfjZ7BeoAWJbYCo7Y3tqWY';

async function obtenerDatosClima(ciudad) {
  try {
    console.log('Intentando obtener datos del clima para la ciudad:', ciudad);
    const response = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${ciudad}?apikey=${ACCUWEATHER_API_KEY}&language=es-ar`);
    const datosClima = response.data;
    // Convertir a formato JSON
    const datosClimaJSON = JSON.stringify(datosClima, null, 2);
    // Guardar en un archivo
    fs.writeFileSync(path.join(__dirname, 'data/clima.json'), datosClimaJSON);
    console.log('Datos del clima leídos y guardados', datosClima);
    return datosClima;
  } catch (error) {
    throw error;
  }
}

// Nueva función para actualizar automáticamente cada 30 minutos
function actualizarAutomaticamente() {
  setInterval(async () => {
    const ciudad = '2920'; // Puedes cambiar esto según tu necesidad
    await obtenerDatosClima(ciudad);
  }, 30 * 60 * 1000 ); // 30 minutos en milisegundos
}

module.exports = {
  obtenerDatosClima,
  actualizarAutomaticamente,
};
