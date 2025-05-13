const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/payments', require('./operaciones/payments'));
app.use('/api/refunds', require('./operaciones/refunds'));

// Otras rutas
app.use('/register', require('./user/register'));
app.use('/login', require('./user/login'));

// Ruta para manejar 404
app.use((req, res) => {
  res.status(404).json({ message: 'Path not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
