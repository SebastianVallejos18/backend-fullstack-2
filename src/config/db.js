require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Local: DB_SSL=false (sin SSL).
// Amazon RDS: SSL activo y se valida el certificado del servidor con el bundle de AWS.
function configurarSsl() {
  if (process.env.DB_SSL === 'false') return false;

  const rutaCa = process.env.DB_SSL_CA || path.join(__dirname, '..', '..', 'certs', 'global-bundle.pem');
  try {
    return { rejectUnauthorized: true, ca: fs.readFileSync(rutaCa, 'utf8') };
  } catch (err) {
    throw new Error('No se encontró el certificado de RDS en ' + rutaCa + ' (ver README)');
  }
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  ssl: configurarSsl(),
});

pool.query('SELECT NOW()')
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => console.error('No se pudo conectar a la base de datos:', err.message));

module.exports = pool;