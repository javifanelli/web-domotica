const mariadb = require('mariadb');

const configmariadb = {
  connectionLimit: 10,
  host: '192.168.0.70',
  port: '3306',
  user: 'root',
  password: 'userpass',
  database: 'temperatura'
};

const pool = mariadb.createPool(configmariadb);

console.log("Iniciando DB");

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión exitosa a", configmariadb.database, "en", configmariadb.host);
    connection.release();
  } catch (err) {
    console.log('Error al establecer la conexión:', err);
    process.exit(1);
  }
})();

module.exports = pool;
