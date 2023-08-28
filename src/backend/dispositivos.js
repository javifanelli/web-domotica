const express = require('express');
const dispositivosRouter = express.Router();
const ultMedicionRouter = express.Router();
const graficoRouter = express.Router();
const medicionesRouter = express.Router();
const deleteDispositivoRouter = express.Router();
const estadoConexionRouter = express.Router();
const borrarTablaRouter = express.Router();
const usuariosRouter = express.Router();
const pool = require('./mysql-connector');

dispositivosRouter.get('/', async function (req, res, next) {
    try {
      const connection = await pool.getConnection();
      const result = await connection.query('SELECT * FROM Dispositivos');
      connection.release();
      res.send(JSON.stringify(result)).status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  });
  
dispositivosRouter.get('/:id', async function (req, res, next) {
    try {
      const connection = await pool.getConnection();
      const result = await connection.query('SELECT * FROM Dispositivos WHERE dispositivoId = ?', req.params.id);
      connection.release();
      res.send(JSON.stringify(result)).status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  });
  
ultMedicionRouter.get('/:id', async function (req, res, next) {
    try {
      const connection = await pool.getConnection();
      const result = await connection.query('SELECT * FROM Mediciones m WHERE m.medicionId = (SELECT MAX(medicionId) FROM Mediciones WHERE dispositivoId = ?)', req.params.id);
      connection.release();
      res.send(JSON.stringify(result)).status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  });
  
graficoRouter.get('/:id', async function (req, res, next) {
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
  
medicionesRouter.get('/:id/mediciones/', async function (req, res, next) {
    try {
      const connection = await pool.getConnection();
      const result = await connection.query('SELECT * FROM Mediciones WHERE dispositivoId = ?', req.params.id);
      connection.release();
      res.send(JSON.stringify(result)).status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  });


deleteDispositivoRouter.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const deleteMedicionesQuery = 'DELETE FROM Mediciones WHERE dispositivoId = ?';
        const deleteDispositivoQuery = 'DELETE FROM Dispositivos WHERE dispositivoId = ?';
        await connection.query(deleteMedicionesQuery, id);
        await connection.query(deleteDispositivoQuery, id);
        await connection.commit();
        connection.release();
        res.send({ message: 'Dispositivo eliminado exitosamente' }).status(200);
        console.log('Solicitud de eliminación recibida para dispositivoId:', id);
        } catch (err) {
            if (connection) {
                await connection.rollback();
                connection.release();
            }
            res.send(err).status(400);
            console.log('Error al eliminar dispositivo:', err);
        }
    }
);

estadoConexionRouter.get('/:id', async function (req, res, next) {
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

borrarTablaRouter.delete('/:id', async function (req, res, next) {
  const id = req.params.id;
  let connection;
  try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      const deleteMedicionesQuery = 'DELETE FROM Mediciones WHERE dispositivoId = ?';
      await connection.query(deleteMedicionesQuery, id);
      await connection.commit();
      connection.release();
      res.send({ message: 'Mediciones eliminadas exitosamente' }).status(200);
      console.log('Solicitud de eliminación recibida para dispositivoId:', id);
      } catch (err) {
          if (connection) {
              await connection.rollback();
              connection.release();
          }
          res.send(err).status(400);
          console.log('Error al eliminar mediciones:', err);
      }
  });

  usuariosRouter.get('/:userId', async function (req, res, next) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    try {
      const connection = await pool.getConnection();
      const result = await connection.query('SELECT * FROM Usuarios WHERE userId = ?', req.params.userId);
      console.log("Los datos del usuario son:", req.params.userId)
      connection.release();
      if (result.length > 0) {
        const userData = result[0];
        res.json(userData).status(200);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });

  usuariosRouter.put('/:userId', async function (req, res, next) {
    try {
      const connection = await pool.getConnection();
      const updatedUser = req.body;
      const queryParams = [
        updatedUser.nombre,
        updatedUser.apellido,
        updatedUser.email,
        updatedUser.password,
        updatedUser.user,
        updatedUser.userId
      ];
      const updateQuery = 'UPDATE Usuarios SET nombre = ?, apellido = ?, email = ?, password = ?, user = ? WHERE userId = ?';
      await connection.query(updateQuery, queryParams);
      connection.release();
      res.status(200).send('Usuario actualizado exitosamente');
      console.log("Datos insertados:", req.body);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el usuario');
    }
  });

module.exports = { dispositivosRouter, ultMedicionRouter, graficoRouter, medicionesRouter, deleteDispositivoRouter, estadoConexionRouter, borrarTablaRouter, usuariosRouter };