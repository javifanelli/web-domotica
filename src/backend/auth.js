const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken'); 
const pool = require('./mysql-connector'); 
// DECLARE JWT-secret
const JWT_Secret = 'your_secret_key';

authRouter.post('/authenticate', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Consultar la base de datos para verificar si el usuario existe
    const connection = await pool.getConnection();
    const queryResult = await connection.query(
      'SELECT * FROM Usuarios WHERE user = ?',
      [username]
    );
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
    connection.release(); // Liberar la conexión después de usarla
  } catch (err) {
    console.error('Error al procesar la solicitud de inicio de sesión:', err);
    res.status(500).send({ message: 'Error en el servidor' });
  }
});

function comparePasswords(plainPassword, hashedPassword) {
  try {
    const isMatch = plainPassword === hashedPassword;
    return isMatch;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    throw error;
  }
}

module.exports = { authRouter, comparePasswords, JWT_Secret };