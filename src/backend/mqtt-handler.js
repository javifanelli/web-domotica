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

module.exports = mqttClient;