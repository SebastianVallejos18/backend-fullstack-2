const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');


const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const openapi = YAML.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'openapi.yaml'), 'utf8'));

const app = express();
const origenes = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((o) => o.trim());
app.use(cors({ origin: origenes }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.get('/api/v1/health', (req, res) => res.json({ estado: 'ok' }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuarioRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = app;
