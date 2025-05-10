const crypto = require('crypto');
const express = require('express');
const { db } = require('../firebase');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Crear un Pago (requiere autenticación)
router.post('/', authMiddleware, async (req, res) => {
  // Extraemos los campos enviados en el body (sin customer_id)
  const { amount, currency, payment_method, description } = req.body;
  
  // Validación de campos obligatorios
  if (!amount || !currency || !payment_method || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  try {
    // Se obtiene el id del usuario autenticado desde el token
    const customer_id = req.user.id;
    
    // Datos del pago
    const paymentData = {
      amount,
      currency,
      payment_method,
      description,
      customer_id, // se asigna automáticamente
      status: "pending",
      created_at: new Date().toISOString()
    };

    // Guardar el pago en la colección "payments" de Firestore
    const paymentRef = await db.collection('payments').add(paymentData);
    const paymentId = paymentRef.id;
    
    // Respuesta con los datos del pago creado
    res.status(201).json({
      payment_id: paymentId,
      ...paymentData,
      links: {
        self: `/api/payments/${paymentId}`,
        webhook: `/api/payments/webhook`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating payment", error });
  }
});

// Obtener todos los pagos del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customer_id = req.user.id;
    const paymentsSnapshot = await db.collection('payments').where('customer_id', '==', customer_id).get();
    const payments = [];
    paymentsSnapshot.forEach(doc => {
      payments.push({ payment_id: doc.id, ...doc.data() });
    });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving payments", error });
  }
});

// Consultar Estado de un Pago (requiere autenticación)
router.get('/:payment_id', authMiddleware, async (req, res) => {
  const { payment_id } = req.params;
  try {
    const paymentDoc = await db.collection('payments').doc(payment_id).get();
    if (!paymentDoc.exists) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ payment_id, ...paymentDoc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving payment", error });
  }
});

// Webhook para Notificaciones de Pago (sin autenticación)
router.put('/webhook', async (req, res) => {
  // Se espera recibir al menos event_type y data con payment_id y new_status.
  const { event_type, data } = req.body;
  
  if (event_type !== 'payment_status_update' || !data || !data.payment_id || !data.new_status) {
    return res.status(400).json({ message: "Invalid webhook data" });
  }
  
  // Generar event_id y timestamp automáticamente si no se envían
  const event_id = req.body.event_id || crypto.randomBytes(8).toString('hex');
  const timestamp = data.timestamp || new Date().toISOString();
  
  try {
    const { payment_id, new_status } = data;
    const paymentRef = db.collection('payments').doc(payment_id);
    const paymentDoc = await paymentRef.get();
    
    if (!paymentDoc.exists) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Actualizar el estado del pago y la fecha de actualización
    await paymentRef.update({
      status: new_status,
      updated_at: timestamp
    });
    
    res.status(200).json({ 
      message: "Payment status updated", 
      event_id, 
      timestamp 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing webhook", error });
  }
});

// Eliminar un Pago 
router.delete('/:payment_id', authMiddleware, async (req, res) => {
  const { payment_id } = req.params;
  
  try {
    const paymentRef = db.collection('payments').doc(payment_id);
    const paymentDoc = await paymentRef.get();
    
    if (!paymentDoc.exists) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Verificar si el pago pertenece al usuario autenticado
    if (paymentDoc.data().customer_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this payment" });
    }
    
    // Eliminar el pago
    await paymentRef.delete();
    
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting payment", error });
  }
});


module.exports = router;