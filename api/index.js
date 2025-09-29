var express = require('express'); // Framework para crear el servidor
var cors = require('cors');
var { conectar } = require('./db');  // Importar la función de conexión a la base de datos
const { Parser } = require('json2csv');

// Crear una instancia de Express
var app = express();

app.use(express.json());
app.use(cors()); // Permite solicitudes desde otros dominios

// Obtener la conexión a la base de datos
var db = conectar(); // Llama a conectar y guarda la conexión

// Ruta de registro de usuarios
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/registro', async (req, res) => {
  const { nombre, apellido, correo, contrasenia, direccion, telefono } = req.body;

  if (!nombre || !apellido || !correo || !contrasenia || !direccion || !telefono) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }

  try {
    db.query('SELECT * FROM usuarios WHERE correo_electronico = ?', [correo], async (err, results) => {
      if (err) {
        console.error('Error al verificar el correo:', err);
        return res.status(500).json({ mensaje: 'Error al verificar el correo' });
      }

      if (results.length > 0) {
        return res.status(409).json({ mensaje: 'El correo ya está registrado.' });
      }

      // Hashear contraseña
      const hash = await bcrypt.hash(contrasenia, saltRounds);

      // Rol cliente por defecto
      const rol_id = 1;

      // Insertar en tabla usuarios
      db.query(
        'INSERT INTO usuarios (nombre, apellido, correo_electronico, contrasenia, rol_id) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, correo, hash, rol_id],
        (err, result) => {
          if (err) {
            console.error('Error al insertar el usuario:', err);
            return res.status(500).json({ mensaje: 'Error al registrar el usuario' });
          }

          const usuario_id = result.insertId;

          // Insertar en tabla clientes (datos extra)
          db.query(
            'INSERT INTO clientes (usuario_id, direccion, telefono) VALUES (?, ?, ?)',
            [usuario_id, direccion, telefono],
            (err, resultCliente) => {
              if (err) {
                console.error('Error al insertar datos del cliente:', err);
                return res.status(500).json({ mensaje: 'Error al registrar datos del cliente' });
              }

              res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error('Error al procesar el registro:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});





// Ruta de inicio de sesión
app.post('/iniciarSesion', (req, res) => {
  const { correo, contrasenia } = req.body;

  if (!correo || !contrasenia) {
    return res.status(400).json({ mensaje: 'Debes enviar correo y contraseña' });
  }

  db.query('SELECT * FROM usuarios WHERE correo_electronico = ?', [correo], async (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = results[0];

    // Verificación de contraseña
    const contraseñaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Si es cliente (rol_id = 1), buscar dirección y teléfono
    if (usuario.rol_id === 1) {
      db.query('SELECT direccion, telefono FROM clientes WHERE usuario_id = ?', [usuario.id], (err, clienteResults) => {
        if (err) {
          console.error('Error al obtener datos del cliente:', err);
          return res.status(500).json({ mensaje: 'Error al obtener datos del cliente' });
        }

        const datosCliente = clienteResults[0] || {};

        res.status(200).json({
          mensaje: 'Inicio de sesión exitoso',
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo_electronico,
            rol_id: usuario.rol_id,
            direccion: datosCliente.direccion || null,
            telefono: datosCliente.telefono || null
          }
        });
      });

    } else if (usuario.rol_id === 2) {
  // Si es administrador, devolver también permisos especiales
  db.query('SELECT permisos_especiales FROM administradores WHERE usuario_id = ?', [usuario.id], (err, adminResults) => {
    if (err) {
      console.error('Error al obtener datos del administrador:', err);
      return res.status(500).json({ mensaje: 'Error al obtener datos del administrador' });
    }

    const adminData = adminResults[0] || {};

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo_electronico,
        rol_id: usuario.rol_id,
        permisos_especiales: adminData.permisos_especiales || null
      }
    });
  });
} else {
  // Otros roles no definidos
  res.status(403).json({ mensaje: 'Rol no autorizado' });
}

  });
});



// ------------------------------
// REGISTRO DE PRODUCTOS
// ------------------------------
app.post('/registrarproducto', (req, res) => {
  const { nombre, categoria, precio, descripcion, imagen } = req.body;

  db.query(
    'INSERT INTO productos (nombre, categoria, precio, descripcion, imagen, activo) VALUES (?, ?, ?, ?, ?, 1)',
    [nombre, categoria, precio, descripcion, imagen],
    (err, result) => {
      if (err) {
        console.error('❌ Error al registrar el producto:', err);
        return res.status(500).send('Error al registrar el producto');
      }
      res.status(201).json({ message: 'Producto registrado' });
    }
  );
});

// ------------------------------
// LISTAR SOLO PRODUCTOS ACTIVOS
// ------------------------------
app.get('/registrarproducto', (req, res) => {
  db.query('SELECT * FROM productos WHERE activo = 1', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener productos:', err);
      return res.status(500).send('Error al obtener productos');
    }
    res.json(results);
  });
});

// ------------------------------
// ACTUALIZAR PRODUCTO (INCLUYE "activo")
// ------------------------------
app.put('/registrarproducto/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, descripcion, imagen, activo } = req.body;

  db.query(
    'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, descripcion = ?, imagen = ?, activo = ? WHERE id = ?',
    [nombre, categoria, precio, descripcion, imagen, activo, id],
    (err, result) => {
      if (err) {
        console.error('❌ Error al actualizar producto:', err);
        return res.status(500).json({ error: 'Error al actualizar el producto' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Producto actualizado correctamente' });
    }
  );
});

// Obtener un producto por ID
app.get('/registrarproducto/:id', (req, res) => {
  const { id } = req.params; // Extraemos el ID del producto desde la URL

  db.query('SELECT * FROM productos WHERE id = ? AND activo = 1', [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener producto:', err);
      return res.status(500).send('Error al obtener producto');
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(results[0]); // Enviamos el primer (y único) producto encontrado
  });
});


// ------------------------------
// BORRADO LÓGICO DE PRODUCTO
// ------------------------------
app.delete('/registrarproducto/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  db.query('UPDATE productos SET activo = 0 WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al marcar producto como inactivo:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto marcado como inactivo exitosamente' });
  });
});



// Iniciar el servidor
app.listen( process.env.PORT || 3000, () => {
    console.log('escuchando el puerto');
});

//Grafico de ventas. 

app.get('/ventas-por-fecha', (req, res) => {
  const tipo = req.query.tipo;

  let query = '';
  if (tipo === 'dia') {
    query = `
      SELECT DATE(fecha) AS periodo, COUNT(*) AS cantidad
      FROM facturas
      GROUP BY DATE(fecha)
      ORDER BY DATE(fecha)
    `;
  } else if (tipo === 'semana') {
    query = `
      SELECT 
        DATE_FORMAT(fecha, '%x-S%v') AS periodo,
        COUNT(*) AS cantidad
      FROM facturas
      GROUP BY periodo
      ORDER BY periodo
    `;
  } else if (tipo === 'mes') {
    query = `
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m') AS periodo,
        COUNT(*) AS cantidad
      FROM facturas
      GROUP BY periodo
      ORDER BY periodo
    `;
  } else {
    return res.status(400).json({ error: 'Tipo de agrupación no válido. Usar dia, semana o mes.' });
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener ventas:', err);
      return res.status(500).json({ error: 'Error al obtener ventas' });
    }

    res.json(results);
  });
});


// insert a la base de datos 

app.post('/crear-factura', (req, res) => {
  const { cliente_id, productos } = req.body;

  if (!cliente_id || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos: cliente o productos faltantes.' });
  }

  const total = productos.reduce((sum, p) => sum + (p.precio_unitario * p.cantidad), 0);
  const fecha = new Date();

  const queryFactura = 'INSERT INTO facturas (cliente_id, fecha, total) VALUES (?, ?, ?)';

  db.query(queryFactura, [cliente_id, fecha, total], (err, result) => {
    if (err) {
      console.error('Error al insertar factura:', err);
      return res.status(500).json({ error: 'Error al crear la factura' });
    }

    const facturaId = result.insertId;

    const detalles = productos.map(p => [
      facturaId,
      p.producto_id,
      p.cantidad,
      p.precio_unitario
    ]);

    const queryDetalles = `
      INSERT INTO factura_detalles (factura_id, producto_id, cantidad, precio_unitario)
      VALUES ?
    `;

    db.query(queryDetalles, [detalles], (err2) => {
      if (err2) {
        console.error('Error al insertar detalles:', err2);
        return res.status(500).json({ error: 'Error al guardar los detalles' });
      }

      res.status(201).json({ mensaje: 'Factura y detalles creados correctamente' });
    });
  });
});

//Grafico de top 5 productos vendidos

app.get('/productos-mas-vendidos', (req, res) => {
  const query = `
    SELECT p.nombre, SUM(fd.cantidad) AS cantidad_vendida
    FROM factura_detalles fd
    JOIN productos p ON fd.producto_id = p.id
    GROUP BY p.id, p.nombre
    ORDER BY cantidad_vendida DESC
    LIMIT 5;
  `;

  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al obtener productos más vendidos:', err);
      return res.status(500).json({ error: 'Error al obtener productos más vendidos' });
    }

    res.json(resultados);
  });
});



app.get('/facturas/exportar-csv', (req, res) => {
  const query = `
    SELECT 
      f.id AS factura_id,
      f.fecha,
      u.nombre AS cliente_nombre,
      u.apellido AS cliente_apellido,
      fd.cantidad,
      fd.precio_unitario,
      p.nombre AS producto_nombre,
      f.total
    FROM facturas f
    JOIN usuarios u ON f.cliente_id = u.id
    JOIN factura_detalles fd ON f.id = fd.factura_id
    JOIN productos p ON fd.producto_id = p.id
    ORDER BY f.id, fd.id
  `;

  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al obtener datos para exportar:', err);
      return res.status(500).json({ error: 'Error al obtener las facturas' });
    }

    res.json(resultados); // 👉 Enviar los datos al frontend
  });
});










