require('dotenv').config();
const { Pool } = require('pg');

// Local: DB_SSL=false. Amazon RDS exige SSL (en el laboratorio se acepta su certificado).
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
});

pool.query('SELECT NOW()')
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => console.error('No se pudo conectar a la base de datos:', err.message));

module.exports = pool;
