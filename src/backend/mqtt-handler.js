// mqtt-handler.js
const mqtt = require('mqtt');
const fs = require('fs');

// Confirmación de lectura de cada certificado
const caCert = fs.readFileSync('/home/node/app/certs/ca.pem');
const privateKey = fs.readFileSync('/home/node/app/certs/client.key');
const clientCert = fs.readFileSync('/home/node/app/certs/client.pem');
console.log('Certificados SSL para MQTT leídos correctamente');

// definición del borker MQTT
const mqttBrokerUrl = '192.168.0.70';
const mqttOptions = {
  host: mqttBrokerUrl,
  port: 8883,
  protocol: 'mqtts',
  ca: caCert,
  key: privateKey,
  cert: clientCert,
};

const mqttTopic = '/home/temperatura/data';
const mqttClient = mqtt.connect(mqttOptions);

mqttClient.on('error', (error) => {
  console.error('Error en la conexión al broker MQTT:', error);
});

// conexión al broker MQTT
mqttClient.on('connect', () => {
    console.log('Conexión exitosa al broker MQTT');
    mqttClient.subscribe(mqttTopic, (error) => {
      if (error) {
        console.error('Error al suscribirse al topic MQTT:', error);
      } else {
        console.log('Suscrito al topic MQTT:', mqttTopic);
      }
    });
  });

mqttClient.on('message', async (topic, message) => {
  console.log('Mensaje recibido en el topic:', topic);
  console.log('Contenido del mensaje:', message.toString());

  try {
    const mensaje = JSON.parse(message.toString());
    const medicion = {
      fecha: mensaje.time,
      valor: mensaje.valor,
      dispositivoId: mensaje.ID,
      rssi: mensaje.RSSI,
    };
    console.log('Mensaje convertido a JSON');

    try {
      const connection = await pool.getConnection();
      const result = await connection.query(
        'INSERT INTO Mediciones (fecha, valor, dispositivoId, rssi) VALUES (?, ?, ?, ?)',
        [medicion.fecha, medicion.valor, medicion.dispositivoId, medicion.rssi]
      );
      connection.release();

      console.log('Medición insertada correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al insertar la medición en la base de datos:', error);
      connection.release();
    }
  } catch (error) {
    console.error('Error al analizar el mensaje JSON:', error);
  }
});

module.exports = mqttClient;
