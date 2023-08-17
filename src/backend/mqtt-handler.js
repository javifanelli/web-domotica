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

const Topic_Temp_In = '/home/temperatura/data';
const Topic_Temp_Out = '/home/temperatura/settings';
const Topic_Luz_In = '/home/dimmer/data';
const Topic_Luz_Out = '/home/dimmer/settings';
const mqttClient = mqtt.connect(mqttOptions);

mqttClient.on('error', (error) => {
  console.error('Error en la conexión al broker MQTT:', error);
});

// conexión al Topic de entrada de datos de temperatura del broker MQTT
mqttClient.on('connect', () => {
    console.log('Conexión exitosa al broker MQTT');
    mqttClient.subscribe(Topic_Temp_In, (error) => {
      if (error) {
        console.error('Error al suscribirse al topic MQTT:', error);
      } else {
        console.log('Suscrito al topic MQTT:', Topic_Temp_In);
      }
    });
  });

// conexión al Topic de salida de seteos de temperatura del broker MQTT
mqttClient.on('connect', () => {
  console.log('Conexión exitosa al broker MQTT');
  mqttClient.subscribe(Topic_Temp_Out, (error) => {
    if (error) {
      console.error('Error al suscribirse al topic MQTT:', error);
    } else {
      console.log('Suscrito al topic MQTT:', Topic_Temp_Out);
    }
  });
});

// conexión al Topic de entrada de datos de iluminación del broker MQTT
mqttClient.on('connect', () => {
  console.log('Conexión exitosa al broker MQTT');
  mqttClient.subscribe(Topic_Luz_In, (error) => {
    if (error) {
      console.error('Error al suscribirse al topic MQTT:', error);
    } else {
      console.log('Suscrito al topic MQTT:', Topic_Luz_In);
    }
  });
});

// conexión al Topic de salida de seteos de iluminación del broker MQTT
mqttClient.on('connect', () => {
  console.log('Conexión exitosa al broker MQTT');
  mqttClient.subscribe(Topic_Luz_Out, (error) => {
    if (error) {
      console.error('Error al suscribirse al topic MQTT:', error);
    } else {
      console.log('Suscrito al topic MQTT:', Topic_Luz_Out);
    }
  });
});

module.exports = mqttClient;