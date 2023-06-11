const mariadb = require('mariadb');

const configmariadb= ({
    connectionLimit: 10,
    host: 'mariadb',
    port: '3306',
    user: 'root',
    password: 'userpass',
    database: 'riegos'
});

const pool = mariadb.createPool(configmariadb);

console.log("Iniciando DB");
pool.getConnection((err, conn) => {
    
    console.log("Intentando conectar a la base de datos");
    if (err) {
        console.log('No se establecio la conexión. ' + err);
        }
     if (conn) {
        console.log('La conexión fue establecida:' + conn);
        connection.release();
         } 
    return;
    }
);

module.exports = pool;