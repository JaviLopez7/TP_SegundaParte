// Importar el módulo mysql para manejar la conexión a la base de datos
var mysql = require('mysql');

// Crear una conexión a la base de datos MySQL
var conexion = mysql.createConnection({
  host: 'mysql.db.mdbgo.com',
  user: 'javi7l_root',
  password: 'Beltran#2025',
  database: 'javi7l_gestionproductos',
  port: 3306
});

// Para conectar a la base de datos
function conectar() {
  conexion.connect((err) => {
    if (err) {
      // Si hay un error, mostrarlo en la consola
      console.error('Error al conectar a la base de datos:', err);
    } else {
      // Si la conexión es exitosa, mostrar un mensaje
      console.log('Conexión a la base de datos exitosa');
    }
  });
  return conexion; // Devolver la conexión
}

// Exportar la función conectar para usarla en otros archivos
module.exports = { conectar };
