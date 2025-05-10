// src/pages/Payments.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Payments = () => {
  const { token } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    currency: '',
    payment_method: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:3000/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      setError('Error al obtener pagos');
    }
  };

  useEffect(() => {
    fetchPayments();
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
      await axios.post('http://localhost:3000/payments', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Pago creado exitosamente');
      fetchPayments();
      setForm({ amount: '', currency: '', payment_method: '', description: '' });
    } catch (err) {
      setError('Error al crear pago');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Pagos</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
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

        {/* Selector de moneda */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="currency-label">Moneda</InputLabel>
          <Select
            labelId="currency-label"
            name="currency"
            value={form.currency}
            label="Moneda"
            onChange={handleChange}
          >
            <MenuItem value="COP">COP - Peso colombiano</MenuItem>
            <MenuItem value="USD">USD - Dólar estadounidense</MenuItem>
            <MenuItem value="EUR">EUR - Euro</MenuItem>

            <MenuItem value="OTRA">Otra</MenuItem>
          </Select>
        </FormControl>

        {/* Selector de método de pago */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="payment-method-label">Método de pago</InputLabel>
          <Select
            labelId="payment-method-label"
            name="payment_method"
            value={form.payment_method}
            label="Método de pago"
            onChange={handleChange}
          >
            <MenuItem value="Cuenta corriente">Cuenta corriente</MenuItem>
            <MenuItem value="Cuenta de ahorros">Cuenta de ahorros</MenuItem>
            <MenuItem value="Tarjeta de débito">Tarjeta de débito</MenuItem>
            <MenuItem value="Tarjeta de crédito">Tarjeta de crédito</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Descripción"
          name="description"
          fullWidth
          margin="normal"
          value={form.description}
          onChange={handleChange}
          required
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Crear Pago
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>Lista de Pagos</Typography>
      <List>
        {payments.map((p) => (
          <ListItem
            key={p.payment_id}
            component={Link}
            to={`/payments/${p.payment_id}`}
            button
          >
            <ListItemText
              primary={`$${p.amount} - ${p.status}`}
              secondary={p.description}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Payments;
