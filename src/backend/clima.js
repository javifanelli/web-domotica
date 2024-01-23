const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ACCUWEATHER_API_KEY = 'y8xWsCFyDQQfjZ7BeoAWJbYCo7Y3tqWY';

async function obtenerDatosClima(ciudad) {
  try {
    const carpetaDatos = path.join(__dirname, 'data'); // Ruta completa a la carpeta 'data'
    
    // Verificar si la carpeta 'data' existe, si no, créala.
    if (!fs.existsSync(carpetaDatos)) {
      fs.mkdirSync(carpetaDatos);
    }

    console.log('Intentando obtener datos del clima para la ciudad:', ciudad);
    const response = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${ciudad}?apikey=${ACCUWEATHER_API_KEY}&language=es-ar`);
    const datosClima = response.data;
    
    // Convertir a formato JSON
    const datosClimaJSON = JSON.stringify(datosClima, null, 2);

    // Guardar en un archivo dentro de la carpeta 'data'
    fs.writeFileSync(path.join(carpetaDatos, 'clima.json'), datosClimaJSON);

    console.log('Datos del clima leídos y guardados en clima.json:', datosClima);
    return datosClima;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  obtenerDatosClima,
};
