require('dotenv').config();
const app = require('./src/app');

if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en el archivo .env');
  process.exit(1);
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`API Sonido Vivo escuchando en el puerto ${PORT}`));
