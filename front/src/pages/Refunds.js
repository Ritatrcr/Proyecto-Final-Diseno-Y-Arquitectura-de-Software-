// src/pages/Refunds.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, TextField, Button, Alert, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Refunds = () => {
  const { token } = useContext(AuthContext);
  const [refunds, setRefunds] = useState([]);
  const [form, setForm] = useState({
    payment_id: '',
    amount: '',
    reason: ''
  });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  const fetchRefunds = async () => {
    try {
      const res = await axios.get('http://localhost:3000/refunds', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefunds(res.data);
    } catch (err) {
      setError('Error al obtener reembolsos');
    }
  };

  useEffect(() => {
    fetchRefunds();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:3000/refunds', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Reembolso solicitado exitosamente');
      fetchRefunds();
      setForm({ payment_id: '', amount: '', reason: '' });
    } catch (err) {
      setError('Error al solicitar reembolso');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Reembolsos</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          label="ID de Pago"
          name="payment_id"
          fullWidth
          margin="normal"
          value={form.payment_id}
          onChange={handleChange}
          required
        />
        <TextField
          label="Monto"
          name="amount"
          type="number"
          fullWidth
          margin="normal"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <TextField
          label="Razón"
          name="reason"
          fullWidth
          margin="normal"
          value={form.reason}
          onChange={handleChange}
          required
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>Solicitar Reembolso</Button>
      </Box>

      <Typography variant="h6" gutterBottom>Lista de Reembolsos</Typography>
      <List>
        {refunds.map((r) => (
          <ListItem
            key={r.refund_id}
            component={Link}
            to={`/refunds/${r.refund_id}`}
            button
          >
            <ListItemText
              primary={`Pago: ${r.payment_id} - ${r.status}`}
              secondary={r.reason}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Refunds;
