//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var pool   = require('./mysql-connector');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');

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

// definicion del borker MQTT
const mqttBrokerUrl = 'mqtts://192.168.0.70:8883'; // Use the container name "mosquitto" as the hostname
const mqttTopic = '/home/Cocina/data';
const mqttClient = mqtt.connect(mqttBrokerUrl);

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
      console.log("Envio mediciones de los dispositivos");
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
      console.log("Envio mediciones del dispositivo", req.params.dispid);
    } catch (err) {
      res.send(err).status(400);
    }
  });
  
/*   app.post('/logriegos/', async function(req, res, next) {
    try {
      const connection = await pool.getConnection();
      const result = await connection.query('INSERT INTO `Log_Riegos` (`apertura`, `fecha`, `electrovalvulaId`) VALUES (?, ?, ?)', [req.body.apertura, req.body.fecha, req.body.electrovalvulaId]);
      connection.release();
      res.send({ 'id': result.insertId }).status(201);
    } catch (err) {
      res.send(err).status(400);
    }
  }); */
  
  app.post('/medicion/', async function(req, res, next) {
    try {
      const connection = await pool.getConnection();
      const result = await connection.query('INSERT INTO `Mediciones` (`fecha`, `valor`, `dispositivoId`) VALUES (?, ?, ?)', [req.body.fecha, req.body.valor, req.body.dispositivoId]);
      connection.release();
      res.send({ 'id': result.insertId }).status(201);
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
  
  /* app.get('/riegos/:electrovalvulaId/', async function(req, res, next) {
    try {
      const connection = await pool.getConnection();
      const result = await connection.query('SELECT * FROM Log_Riegos WHERE electrovalvulaId = ?', req.params.electrovalvulaId);
      connection.release();
      res.send(JSON.stringify(result)).status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  }); */
  

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly on:", PORT);
});

//=======[ End of file ]=======================================================
