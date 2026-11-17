const db = require('../config/db');
const pool = db.pool || db;

const COLUMNAS = 'id, nombre, email, rol, activo, creado_en';

const crear = async ({ nombre, email, passwordHash, rol }) => {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol)
     VALUES ($1, $2, $3, $4) RETURNING ${COLUMNAS}`,
    [nombre, email, passwordHash, rol]
  );
  return rows[0];
};

const buscarPorEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return rows[0];
};

const buscarPorId = async (id) => {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM usuarios WHERE id = $1`, [id]);
  return rows[0];
};

const listar = async () => {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM usuarios ORDER BY id`);
  return rows;
};

const actualizar = async (id, { nombre, rol }) => {
  const { rows } = await pool.query(
    `UPDATE usuarios SET nombre = COALESCE($2, nombre), rol = COALESCE($3, rol)
     WHERE id = $1 RETURNING ${COLUMNAS}`,
    [id, nombre ?? null, rol ?? null]
  );
  return rows[0];
};

const desactivar = async (id) => {
  const { rows } = await pool.query(
    `UPDATE usuarios SET activo = FALSE WHERE id = $1 RETURNING ${COLUMNAS}`,
    [id]
  );
  return rows[0];
};

module.exports = { crear, buscarPorEmail, buscarPorId, listar, actualizar, desactivar };
