const express = require('express');
const app = express();
const paymentsRoutes = require('./operaciones/payments');
const refundsRoutes = require('./operaciones/refunds');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/payments', paymentsRoutes);
app.use('/refunds', refundsRoutes);

// Solo iniciar el servidor si el archivo se ejecuta directamente
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
