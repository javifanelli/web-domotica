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
const { authRouter, comparePasswords } = require('./routes/auth');
const { JWT_Secret } = require('./routes/auth');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

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

mqttClient.on('message', async (topic, message) => {
  console.log('Mensaje recibido en el topic:', topic);
  console.log('Contenido del mensaje:', message.toString());

  if (topic === "/home/temperatura/data" || topic === "/home/dimmer/data") {
    let connection; // Definir la variable connection fuera del bloque try
    try {
      const mensaje = JSON.parse(message.toString());
      const medicion = {
        dispositivoId: mensaje.ID,
        tipo: mensaje.tipo,
        fecha: mensaje.time,
        valor: mensaje.valor,
        set_point: mensaje.set_point,
        modo: mensaje.modo,
        salida: mensaje.salida,
      };
      console.log('Mensaje convertido a JSON');

      connection = await pool.getConnection();

      const result = await connection.query(
        'INSERT INTO Mediciones (dispositivoId, tipo, fecha, valor, set_point, modo, salida) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [medicion.dispositivoId, medicion.tipo, medicion.fecha, medicion.valor, medicion.set_point, medicion.modo, medicion.salida]
      );

      console.log('Medición insertada correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al insertar la medición en la base de datos:', error);
    } finally {
      if (connection) {
        connection.release(); // Liberar la conexión en el bloque finally
      }
    }
  }
});

app.use('/', authRouter);

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
    const deleteMedicionesQuery = 'DELETE FROM Mediciones WHERE dispositivoId = ?';
    const deleteDispositivoQuery = 'DELETE FROM Dispositivos WHERE dispositivoId = ?';
    console.log('Comenzando transacción del ID: ', req.params.id);
    connection.beginTransaction(async (err) => {
      if (err) {
        connection.release();
        res.send(err).status(400);
        console.log('Error en la transaccion');
        return;
      }
      try {
        console.log('Borrando mediciones y dispositivo');
        await connection.query(deleteMedicionesQuery, req.params.id); // Primero eliminar las mediciones asociadas al dispositivo
        const result = await connection.query(deleteDispositivoQuery, req.params.id); // Luego eliminar el dispositivo
        // Commit la transacción si todo se realizó exitosamente
        connection.commit((commitErr) => {
          if (commitErr) {
            connection.rollback(() => {
              connection.release();
              res.send(commitErr).status(400);
              console.log('Error en el commit');
            });
            return;
          }
          connection.release();
          res.send(JSON.stringify(result)).status(200);
          console.log('Solicitud de eliminación recibida para dispositivoId:', req.params.id);

        });
      } catch (err) {
        // Rollback la transacción en caso de error
        connection.rollback(() => {
          connection.release();
          res.send(err).status(400);
          console.log('Haciendo un rollback');
        });
      }
    });
  } catch (err) {
    res.send(err).status(400);
    console.log('Error antes de hacer la transacción');
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

//=======[ End of Main module code ]================================================-------
