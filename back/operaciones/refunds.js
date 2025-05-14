const express = require('express');
const router = express.Router();

const refunds = []; // Array temporal
let refundCounter = 1;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  req.user = { id: 'user123' };
  next();
};

router.post('/', authMiddleware, (req, res) => {
  const refund = {
    refund_id: refundCounter++,
    userId: req.user.id,
    reason: req.body.reason,
    status: 'pending'
  };
  refunds.push(refund);
  res.status(201).json(refund);
});

router.get('/', authMiddleware, (req, res) => {
  const userRefunds = refunds.filter(r => r.userId === req.user.id);
  res.status(200).json(userRefunds);
});

router.get('/:id', authMiddleware, (req, res) => {
  const refund = refunds.find(r => r.refund_id == req.params.id);
  if (!refund) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(refund);
});

router.post('/webhook/:id', (req, res) => {
  const refund = refunds.find(r => r.refund_id == req.params.id);
  if (!refund) return res.status(404).json({ error: 'Not found' });
  refund.status = req.body.status;
  res.status(200).json({ message: 'Refund status updated' });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const index = refunds.findIndex(r => r.refund_id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  refunds.splice(index, 1);
  res.status(200).json({ message: 'Refund deleted successfully' });
});

module.exports = router;
