//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

const express = require('express');
const app = express();
const pool = require('./mysql-connector');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');
const mqttClient = require('./mqtt-handler');
const transporter = require('./nodemailer');
const { authRouter } = require('./auth');
const { JWT_Secret } = require('./auth');
const { dispositivosRouter, ultMedicionRouter, graficoRouter, medicionesRouter, deleteDispositivoRouter, estadoConexionRouter, borrarTablaRouter, usuariosRouter, agregaRouter, modificarDispositivoRouter } = require('./dispositivos');
const clima = require('./clima');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

const auth = function (req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
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
      const dispositivoId = mensaje.ID;
      const dispositivoMac = mensaje.MAC;
      connection = await pool.getConnection();
      const macResult = await connection.query('SELECT mac FROM Dispositivos WHERE dispositivoId = ?', [dispositivoId]);
      const macGuardada = macResult[0].mac;
      if (!macGuardada) {
        await connection.query('UPDATE Dispositivos SET mac = ? WHERE dispositivoId = ?', [dispositivoMac, dispositivoId]);
        console.log('MAC del dispositivo actualizada en la tabla de dispositivos.');
      } else if (dispositivoMac === macGuardada) {
        const medicion = {
          dispositivoId: dispositivoId,
          tipo: mensaje.tipo,
          fecha: mensaje.time,
          valor: mensaje.valor,
          set_point: mensaje.set_point,
          modo: mensaje.modo,
          salida: mensaje.salida,
          hon: mensaje.hon,
          mon: mensaje.mon,
          hoff: mensaje.hoff,
          moff: mensaje.moff
        };
        console.log('Mensaje convertido a JSON');
        const result = await connection.query(
          'INSERT INTO Mediciones (dispositivoId, tipo, fecha, valor, set_point, modo, salida, hon, mon, hoff, moff) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [medicion.dispositivoId, medicion.tipo, medicion.fecha, medicion.valor, medicion.set_point, medicion.modo, medicion.salida, medicion.hon, medicion.mon, medicion.hoff, medicion.moff]
        );
        console.log('Medición insertada correctamente en la base de datos.');
        const alarmResult = await connection.query('SELECT alarma FROM Dispositivos WHERE dispositivoId = ?', [dispositivoId]);
        const activeResult = await connection.query('SELECT act_al FROM Dispositivos WHERE dispositivoId = ?', [dispositivoId]);
        const ubicacionResult = await connection.query('SELECT ubicacion FROM Dispositivos WHERE dispositivoId = ?', [dispositivoId]);
        const alarm = alarmResult[0].alarma;
        const active = activeResult[0].act_al;
        const ubicacion = ubicacionResult[0].ubicacion;
        const userResult = await connection.query('SELECT * FROM Usuarios WHERE updated = 1');
        const mailList = userResult.map(user => user.email);
        console.log('Lista de correos:', mailList);
        if (medicion.valor >= alarm && active === 1) {
          console.log("¡Ey! Los valores son altos para el dispositivo:", dispositivoId);
          const mailOptions = {
            from: 'automaticoh@gmail.com',
            to: mailList.join('; '),
            subject: 'Alarma de valor alto',
            text: `Hola,
            el dispositivo ${dispositivoId} de la ubicación ${ubicacion} tiene un valor de temperatura alto. La última medición fue de ${mensaje.valor}º, y la alarma está seteada en ${alarm}º.
            Por favor, revisá que todo esté bien.
            Muchas gracias.
            Atte,
            el equipo de Domótica.`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.error('Error al enviar el correo:', error);
            } else {
              console.log('Correo enviado con éxito. Información:', info.response);
            }
          });
        }
      } else {
        console.log('La MAC del dispositivo no coincide. Datos descartados.');
      }
    } catch (error) {
      console.error('Error al insertar la medición en la base de datos:', error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  else if (topic === "/home/config") {
    try {
      const mensaje = JSON.parse(message.toString());
      const dispositivoId = mensaje.ID;
      console.log("Mensaje de configuración recibido en el topic config:", mensaje.ID);
      const connection = await pool.getConnection();
      const configResult = await connection.query('SELECT * FROM Mediciones WHERE dispositivoId = ? ORDER BY fecha DESC LIMIT 1', [dispositivoId]);
      let datosConfiguracion;
      if (configResult.length > 0) {
        const configuracion = configResult[0];
        datosConfiguracion = {
          id: configuracion.dispositivoId,
          set_point: configuracion.set_point,
          modo: configuracion.modo,
          salida: configuracion.salida,
          hon: configuracion.hon,
          mon: configuracion.mon,
          hoff: configuracion.hoff,
          moff: configuracion.moff
        };
        mqttClient.publish('/home/setup', JSON.stringify(datosConfiguracion));
        console.log('Datos de configuración enviados al dispositivo', datosConfiguracion);
      } else {
        console.log('No se encontró configuración para el dispositivo');
      }
      connection.release();
    } catch (error) {
      console.error('Error al obtener y enviar datos de configuración:', error);
    }
  }  
});

app.post('/enviardatos', async (req, res) => {
  try {
    const { nuevoSetPoint, horaEncendido, minutoEncendido, horaApagado, minutoApagado, tipo, dispositivoId, mododisp, salida } = req.body;
    const datos = {
      setpoint: nuevoSetPoint,
      hon: horaEncendido,
      mon: minutoEncendido,
      hoff: horaApagado,
      moff: minutoApagado,
      id: dispositivoId,
      modo: mododisp,
      salida: salida,
    };
    // Publicar datos por MQTT
    if (tipo === 'Temperatura') {
      mqttClient.publish('/home/temperatura/settings', JSON.stringify(datos));
    } else if (tipo === 'Luz dimmer') {
      mqttClient.publish('/home/dimmer/settings', JSON.stringify(datos));
    }
    res.status(200).send({ message: 'Datos enviados correctamente por MQTT' });
  } catch (error) {
    console.error('Error al enviar los datos por MQTT:', error);
    res.status(500).send({ message: 'Error al enviar los datos por MQTT' });
  }
});

app.get('/datosclima', async (req, res) => {
  try {
    const datosClima = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/clima.json'), 'utf8'));
    console.log('Datos del clima:', datosClima);
    res.status(200).send({ datosClima });
  } catch (error) {
    console.error('Error al obtener los datos del clima:', error);
    res.status(500).send({ message: 'Error al obtener los datos del clima' });
  }
});

clima.actualizarAutomaticamente();

app.use('/', authRouter);
app.use('/dispositivos', dispositivosRouter);
app.use('/ultmedicion', ultMedicionRouter);
app.use('/grafico', graficoRouter);
app.use('/dispositivos', medicionesRouter);
app.use('/dispositivos', deleteDispositivoRouter);
app.use('/estadoconexion', estadoConexionRouter);
app.use('/borrartabla', borrarTablaRouter);
app.use('/usuario', usuariosRouter);
app.use('/agregar', agregaRouter);
app.use('/modificar', modificarDispositivoRouter);


app.listen(PORT, function (req, res) {
  console.log('NodeJS API running correctly on:', PORT);
});

//=======[ End of Main module code ]================================================-------
