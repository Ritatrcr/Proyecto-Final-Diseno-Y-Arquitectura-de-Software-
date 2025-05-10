// src/pages/PaymentDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Alert, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const fetchPayment = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/payments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayment(res.data);
      setNewStatus(res.data.status);
    } catch (err) {
      setError('Error al obtener el detalle del pago');
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const handleUpdateStatus = async () => {
      setError('');
      setSuccess('');
      try {
        await axios.put(
          `http://localhost:3000/payments/webhook`,
          {
            event_type: "payment_status_update",
            data: {
              payment_id: id,
              new_status: newStatus
            }
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Estado del pago actualizado correctamente");
        fetchPayment();
      } catch (err) {
        setError('Error al actualizar el estado del pago');
      }
    };
  
  
  

  const handleDeletePayment = async () => {
    setError('');
    setSuccess('');
    try {
      await axios.delete(`http://localhost:3000/payments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Pago eliminado correctamente');
      setTimeout(() => navigate('/payments'), 2000); // Redirigir después de eliminar
    } catch (err) {
      setError('Error al eliminar el pago');
    }
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!payment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Cargando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 3 }}>
      {success && <Alert severity="success">{success}</Alert>}
      <Box>
        <Typography variant="h5" sx={{ color: '#0033a0', fontWeight: 'bold', marginBottom: 2 }}>
          Detalle del Pago
        </Typography>
        <Typography><strong>Monto:</strong> ${payment.amount}</Typography>
        <Typography><strong>Moneda:</strong> {payment.currency}</Typography>
        <Typography><strong>Método de Pago:</strong> {payment.payment_method}</Typography>
        <Typography><strong>Descripción:</strong> {payment.description}</Typography>
        <Typography><strong>Estado:</strong> {payment.status}</Typography>
        <Typography><strong>Fecha de Creación:</strong> {payment.created_at}</Typography>

        {/* Selección de estado */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Actualizar Estado</InputLabel>
          <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Aprobado">Aprobado</MenuItem>
            <MenuItem value="Rechazado">Rechazado</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" sx={{ mt: 2, backgroundColor: '#3366FF' }} onClick={handleUpdateStatus}>
          Actualizar Estado
        </Button>

        {/* Botón para eliminar */}
        <Button variant="contained" color="error" sx={{ mt: 2, ml: 2 }} onClick={handleDeletePayment}>
          Eliminar Pago
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentDetail;
