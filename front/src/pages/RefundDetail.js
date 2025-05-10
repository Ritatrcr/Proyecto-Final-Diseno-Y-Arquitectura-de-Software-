// src/pages/RefundDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Alert, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RefundDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [refund, setRefund] = useState(null);
  const [error, setError] = useState('');

  const fetchRefund = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/refunds/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefund(res.data);
    } catch (err) {
      setError('Error al obtener el detalle del reembolso');
    }
  };

  useEffect(() => {
    fetchRefund();
  }, [id]);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!refund) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Cargando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ color: '#0033a0', fontWeight: 'bold', marginBottom: 2 }}>
          Detalle del Reembolso
        </Typography>
        <Typography sx={{ fontSize: 16 }}><strong>ID de Pago:</strong> {refund.payment_id}</Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Monto:</strong> ${refund.amount}</Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Razón:</strong> {refund.reason}</Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Estado:</strong> {refund.status}</Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Fecha de Solicitud:</strong> {refund.requested_at}</Typography>
        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" sx={{ backgroundColor: '#3366FF', color: 'white' }}>Solicitar otro reembolso</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RefundDetail;
