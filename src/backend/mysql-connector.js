var mariadb = require('mariadb');

const configMysql= ({
    connectionLimit: 10,
    host: 'mariadb-server',
    port: '3306',
    user: 'root',
    password: 'userpass',
    database: 'riegos'
});

const pool = mysql.createPool(configMysql);

pool.getConnection((err, connection) => {
    if (err) {
       console.log('No se establecio la conexión. ' + err)
        }
    if (connection) {
        console.log('La conexión fue establecida:' + connection)
        connection.release();
        }
    return;
    }
);

module.exports = pool;