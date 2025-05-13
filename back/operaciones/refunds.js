const express = require('express');
const crypto = require('crypto');
const { db } = require('../firebase');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Solicitar un Reembolso (usa customer_id del token)
router.post('/', authMiddleware, async (req, res) => {
  const { payment_id, amount, reason } = req.body;

  if (!payment_id || !amount || !reason) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Verificar si el pago existe en la base de datos
    const paymentDoc = await db.collection('payments').doc(payment_id).get();
    if (!paymentDoc.exists) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const customer_id = req.user.id; // Obtener el customer_id desde el token

    // Verificar si el pago pertenece al usuario autenticado
    if (paymentDoc.data().customer_id !== customer_id) {
      return res.status(403).json({ message: "You are not authorized to request this refund" });
    }

    const refundData = {
      payment_id,
      amount,
      reason,
      customer_id,
      status: "pending",
      requested_at: new Date().toISOString(),
    };

    // Crear el reembolso en la base de datos
    const refundRef = await db.collection('refunds').add(refundData);

    res.status(201).json({
      refund_id: refundRef.id,
      ...refundData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating refund", error });
  }
});

// Obtener todos los reembolsos del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customer_id = req.user.id;
    const refundsSnapshot = await db.collection('refunds').where('customer_id', '==', customer_id).get();

    if (refundsSnapshot.empty) {
      return res.status(404).json({ message: "No refunds found" });
    }

    const refunds = [];
    refundsSnapshot.forEach(doc => {
      refunds.push({ refund_id: doc.id, ...doc.data() });
    });

    res.status(200).json(refunds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving refunds", error });
  }
});

// Obtener un reembolso por refund_id (verificando que pertenezca al usuario)
router.get('/:refund_id', authMiddleware, async (req, res) => {
  const { refund_id } = req.params;

  try {
    const refundDoc = await db.collection('refunds').doc(refund_id).get();
    if (!refundDoc.exists) {
      return res.status(404).json({ message: "Refund not found" });
    }

    // Verificar que el reembolso pertenezca al usuario autenticado
    if (refundDoc.data().customer_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this refund" });
    }

    res.status(200).json({ refund_id, ...refundDoc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving refund", error });
  }
});

// Webhook para Notificaciones de Reembolso
router.put('/webhook', async (req, res) => {
  const { event_type, data } = req.body;

  // Verificar que los datos necesarios estén presentes
  if (event_type !== 'refund_status_update' || !data || !data.refund_id || !data.new_status) {
    return res.status(400).json({ message: "Invalid webhook data" });
  }

  const event_id = req.body.event_id || crypto.randomBytes(8).toString('hex');
  const timestamp = data.timestamp || new Date().toISOString();

  try {
    const { refund_id, new_status } = data;
    const refundRef = db.collection('refunds').doc(refund_id);
    const refundDoc = await refundRef.get();

    if (!refundDoc.exists) {
      return res.status(404).json({ message: "Refund not found" });
    }

    await refundRef.update({
      status: new_status,
      updated_at: timestamp,
    });

    res.status(200).json({
      message: "Refund status updated",
      event_id,
      timestamp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing refund webhook", error });
  }
});

// Eliminar un Reembolso
router.delete('/:refund_id', authMiddleware, async (req, res) => {
  const { refund_id } = req.params;

  try {
    const refundRef = db.collection('refunds').doc(refund_id);
    const refundDoc = await refundRef.get();

    if (!refundDoc.exists) {
      return res.status(404).json({ message: "Refund not found" });
    }

    // Verificar si el reembolso pertenece al usuario autenticado
    if (refundDoc.data().customer_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this refund" });
    }

    // Eliminar el reembolso
    await refundRef.delete();

    res.status(200).json({ message: "Refund deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting refund", error });
  }
});

module.exports = router;
