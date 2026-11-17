// Uso: node scripts/crear-admin.js "Nombre" correo@dominio.cl 'ClaveSegura123'
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/config/db');
const pool = db.pool || db;

(async () => {
  const [nombre, email, password] = process.argv.slice(2);
  if (!nombre || !email || !password || password.length < 8) {
    console.log('Uso: node scripts/crear-admin.js "Nombre" correo@dominio.cl clave(8+)');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, 'ADMIN')
     ON CONFLICT (email) DO UPDATE SET rol = 'ADMIN', password_hash = EXCLUDED.password_hash, activo = TRUE
     RETURNING id, email, rol`,
    [nombre, email.toLowerCase(), hash]
  );
  console.log('Administrador listo:', rows[0]);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
