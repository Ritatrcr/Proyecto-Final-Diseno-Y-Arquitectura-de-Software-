const express = require('express');
const router = express.Router();

const payments = []; // Array temporal simulado
let idCounter = 1;

// Middleware simulado de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  req.user = { id: 'user123' }; // Simulación
  next();
};

router.post('/', authMiddleware, (req, res) => {
  const payment = {
    payment_id: idCounter++,
    userId: req.user.id,
    amount: req.body.amount,
    status: 'pending'
  };
  payments.push(payment);
  res.status(201).json(payment);
});

router.get('/', authMiddleware, (req, res) => {
  const userPayments = payments.filter(p => p.userId === req.user.id);
  res.status(200).json(userPayments);
});

router.get('/:id', authMiddleware, (req, res) => {
  const payment = payments.find(p => p.payment_id == req.params.id);
  if (!payment) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(payment);
});

router.post('/webhook/:id', (req, res) => {
  const payment = payments.find(p => p.payment_id == req.params.id);
  if (!payment) return res.status(404).json({ error: 'Not found' });
  payment.status = req.body.status;
  res.status(200).json({ message: 'Payment status updated' });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const index = payments.findIndex(p => p.payment_id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  payments.splice(index, 1);
  res.status(200).json({ message: 'Payment deleted successfully' });
});

module.exports = router;
