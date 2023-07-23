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

function comparePasswords(plainPassword, hashedPassword) {
  try {
    const isMatch = plainPassword === hashedPassword;
    return isMatch;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    throw error;
  }
}

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));
// to enable cors
app.use(cors(corsOptions));


//=======[ Main module code ]==================================================
app.post('/authenticate', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Consultar la base de datos para verificar si el usuario existe
    const connection = await pool.getConnection();
    const queryResult = await connection.query(
      'SELECT * FROM Usuarios WHERE user = ?',
      [username]
    );
    connection.release();

    if (queryResult.length === 1) {
      // Verificar la contraseña del usuario
      const user = queryResult[0];
      const isPasswordValid = comparePasswords(password, user.password);

      if (isPasswordValid) {
        // Generar el token JWT
        const token = jwt.sign({ username: user.user }, JWT_Secret);
        res.status(200).send({ token });
      } else {
        res.status(401).send({ message: 'Credenciales inválidas' });
      }
    } else {
      res.status(401).send({ message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error al procesar la solicitud de inicio de sesión:', err);
    res.status(500).send({ message: 'Error en el servidor' });
  }
});


mqttClient.on('message', async (topic, message) => {
  console.log('Mensaje recibido en el topic:', topic);
  console.log('Contenido del mensaje:', message.toString());
  try {
    const mensaje = JSON.parse(message.toString());
    const medicion = {
      dispositivoId: mensaje.ID,
      tipo: mensaje.tipo,
      fecha: mensaje.time,
      valor: mensaje.valor,
      salida: mensaje.salida,
    };
    console.log('Mensaje convertido a JSON');

    try {
      const connection = await pool.getConnection();
      const result = await connection.query(
        'INSERT INTO Mediciones (dispositivoId, tipo, fecha, valor, salida) VALUES (?, ?, ?, ?, ?)',
        [medicion.dispositivoId, medicion.tipo, medicion.fecha, medicion.valor, medicion.salida]
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
    connection.beginTransaction(async (err) => {
      if (err) {
        connection.release();
        res.send(err).status(400);
        return;
      }
      try {
        // Primero eliminar las mediciones asociadas al dispositivo
        await connection.query(deleteMedicionesQuery, req.params.id);
        // Luego eliminar el dispositivo
        const result = await connection.query(deleteDispositivoQuery, req.params.id);
        // Commit la transacción si todo se realizó exitosamente
        connection.commit((commitErr) => {
          if (commitErr) {
            connection.rollback(() => {
              connection.release();
              res.send(commitErr).status(400);
            });
            return;
          }
          connection.release();
          res.send(JSON.stringify(result)).status(200);
        });
      } catch (err) {
        // Rollback la transacción en caso de error
        connection.rollback(() => {
          connection.release();
          res.send(err).status(400);
        });
      }
    });
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
