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
const { authRouter, comparePasswords } = require('./auth');
const { JWT_Secret } = require('./auth');
const { dispositivosRouter, ultMedicionRouter, graficoRouter, medicionesRouter, deleteDispositivoRouter, estadoConexionRouter, borrarTablaRouter, usuariosRouter } = require('./dispositivos');

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
    let connection;
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
        hon: mensaje.hon,
        mon: mensaje.mon,
        hoff: mensaje.hoff,
        moff: mensaje. moff
      };
      console.log('Mensaje convertido a JSON');
      connection = await pool.getConnection();
      const result = await connection.query(
        'INSERT INTO Mediciones (dispositivoId, tipo, fecha, valor, set_point, modo, salida, hon, mon, hoff, moff) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [medicion.dispositivoId, medicion.tipo, medicion.fecha, medicion.valor, medicion.set_point, medicion.modo, medicion.salida, medicion.hon, medicion.mon, medicion.hoff, medicion.moff]
      );
      console.log('Medición insertada correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al insertar la medición en la base de datos:', error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
});

app.post('/enviardatos', async (req, res) => {
  try {
    const { nuevoSetPoint, horaEncendido, minutoEncendido, horaApagado, minutoApagado, tipo } = req.body;
    const datos = {
      setpoint: nuevoSetPoint,
      hon: horaEncendido,
      mon: minutoEncendido,
      hoff: horaApagado,
      moff: minutoApagado
    };
    if(tipo==='Temperatura'){
    mqttClient.publish('/home/temperatura/settings', JSON.stringify(datos));}
    if(tipo==='Luz dimmer'){
      mqttClient.publish('/home/dimmer/settings', JSON.stringify(datos));}
    res.status(200).send({ message: 'Datos enviados correctamente por MQTT' });
  } catch (error) {
    console.error('Error al enviar los datos por MQTT:', error);
    res.status(500).send({ message: 'Error al enviar los datos por MQTT' });
  }
});

app.use('/', authRouter);

app.use('/dispositivos', dispositivosRouter);
app.use('/ultmedicion', ultMedicionRouter);
app.use('/grafico', graficoRouter);
app.use('/dispositivos', medicionesRouter);
app.use('/dispositivos', deleteDispositivoRouter);
app.use('/estadoconexion', estadoConexionRouter);
app.use('/borrartabla', borrarTablaRouter);
app.use('/usuario', usuariosRouter);

app.listen(PORT, function (req, res) {
  console.log('NodeJS API running correctly on:', PORT);
});

//=======[ End of Main module code ]================================================-------
