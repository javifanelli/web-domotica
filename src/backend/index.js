//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

const express = require('express');
const app = express();
const pool = require('./mysql-connector');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');
const fs = require('fs');
const mqttClient = require('./mqtt-handler');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

// DECLARE JWT-secret
const JWT_Secret = 'your_secret_key';

var testUser = { username: 'javier', password: 'ceiot' };

const auth = function (req, res, next) {
  let autHeader = req.headers.authorization || '';
  if (autHeader.startsWith('Bearer ')) {
    token = autHeader.split(' ')[1];
  } else {
    res.status(401).send({ message: 'No hay token en la cabecera' });
  }
  jwt.verify(token, JWT_Secret, function (err) {
    if (err) {
      console.log('error en el token');
      res.status(403).send({ meesage: 'Token inválido' });
    }
  });
  next();
};

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));
// to enable cors
app.use(cors(corsOptions));


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

app.get('/dispositivos/', async function (req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM Dispositivos');
    connection.release();
    res.send(JSON.stringify(result)).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
});

app.get('/dispositivos/:id', async function (req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM Dispositivos WHERE dispositivoId = ?', req.params.id);
    connection.release();
    res.send(JSON.stringify(result)).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
});

app.get('/ultmedicion/:dispid', async function (req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM Mediciones m WHERE m.medicionId = (SELECT MAX(medicionId) FROM Mediciones WHERE dispositivoId = ?)', req.params.dispid);
    connection.release();
    res.send(JSON.stringify(result)).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
});

app.get('/grafico/:id', async function (req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM Mediciones WHERE dispositivoId = ? ORDER BY fecha DESC LIMIT 10', req.params.id);
    console.log('Mandando grafico');
    connection.release();
    res.send(JSON.stringify(result)).status(200);
    console.log(JSON.stringify(result));
  } catch (err) {
    res.send(err).status(400);
  }
});

app.get('/dispositivos/:id/mediciones/', async function (req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM Mediciones WHERE dispositivoId = ?', req.params.id);
    connection.release();
    res.send(JSON.stringify(result)).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
});

app.delete('/dispositivos/:id', async function (req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM Dispositivos WHERE dispositivoId = ?', req.params.id);
    connection.release();
    res.send(JSON.stringify(result)).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
});

app.get('/estadoconexion/:id', async function (req, res, next) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT fecha FROM Mediciones WHERE dispositivoId = ? ORDER BY fecha DESC LIMIT 1', req.params.id);
    connection.release();
    const fechaUltimaMedicion = result[0].fecha;
    const fechaActual = new Date();
    const tiempoInactividad = fechaActual.getTime() - fechaUltimaMedicion.getTime();
    const estado = tiempoInactividad > 300000 ? 'OFFLINE' : 'ONLINE';
    res.send({ estado }).status(200);
  } catch (err) {
    res.send(err).status(400);
  }
});

app.listen(PORT, function (req, res) {
  console.log('NodeJS API running correctly on:', PORT);
});

//=======[ End of file ]================================================-------
