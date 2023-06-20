//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

const express = require('express');
const app = express();
const pool = require('./mysql-connector');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');
const fs = require('fs');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

// DECLARE JWT-secret
const JWT_Secret = 'your_secret_key';

var testUser = { username: 'javier', password: 'ceiot' };

const auth = function (req, res, next) {
    let autHeader = (req.headers.authorization || '')
    if (autHeader.startsWith('Bearer ')) {
        token = autHeader.split(' ')[1]
    } else {
        res.status(401).send({ message: "No hay token en la cabecera" })
    }
    jwt.verify(token, JWT_Secret, function(err) {
        if (err) {
            console.log('error en el token')
            res.status(403).send({ meesage: "Token inválido" })
        }
    })
    next()
} 

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));
// to enable cors
app.use(cors(corsOptions));

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

//=======[ Main module code ]==================================================
app.post('/authenticate', (req, res) => {
  if (req.body) {
    var user = req.body;
    console.log(user);

    // Verificar las credenciales del usuario
    if (testUser.username === req.body.username && testUser.password === req.body.password) {
      // Generar el token JWT
      var token = jwt.sign(user, JWT_Secret);
      res.status(200).send({
        signed_user: user,
        token: token
      });
    } else {
      res.status(403).send({
        errorMessage: 'Auth required!'
      });
    }
  } else {
    res.status(403).send({
      errorMessage: 'Please provide username and password'
    });
  }
});

app.get('/dispositivos/', async function(req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM Dispositivos');
    connection.release();
    res.send(JSON.stringify(result)).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
});

app.get('/dispositivos/:id', async function(req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM Dispositivos WHERE dispositivoId = ?', req.params.id);
    connection.release();
    res.send(JSON.stringify(result)).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
});

app.get('/ultmedicion/:dispid', async function(req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM Mediciones m WHERE m.medicionId = (SELECT MAX(medicionId) FROM Mediciones WHERE dispositivoId = ?)', req.params.dispid);
    connection.release();
    res.send(JSON.stringify(result)).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
});

app.get('/dispositivos/:id/mediciones/', async function(req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM Mediciones WHERE dispositivoId = ?', req.params.id);
    connection.release();
    res.send(JSON.stringify(result)).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
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
      rssi: mensaje.RSSI
    };
    console.log("Mensaje convertido a JSON");

    try {
      const connection = await pool.getConnection();
      const result = await connection.query('INSERT INTO Mediciones (fecha, valor, dispositivoId, rssi) VALUES (?, ?, ?, ?)', [medicion.fecha, medicion.valor, medicion.dispositivoId, medicion.rssi]);
      connection.release();

      console.log('Medición insertada correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al insertar la medición en la base de datos:', error);
    }
  } catch (error) {
    console.error('Error al analizar el mensaje JSON:', error);
  }
});

app.listen(PORT, function(req, res) {
  console.log("NodeJS API running correctly on:", PORT);
});

//=======[ End of file ]================================================-------
