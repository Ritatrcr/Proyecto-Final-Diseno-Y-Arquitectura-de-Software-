// src/pages/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Petición al backend
      const res = await axios.post('http://localhost:3000/login', { email, password });
      // Guardar token y usuario en contexto
      login(res.data.token, res.data.user || { email });
      setSuccess('Sesión iniciada exitosamente');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Columna Izquierda: Imagen de Fondo */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: 'url("/images/myBackground.png")', // Ajusta ruta
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          m: 0,
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          color: '#fff',
        }}
      >
        <Box sx={{ pl: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            BancaPro
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome back.
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 400 }}>
            Log in to continue with our management system!
          </Typography>
        </Box>
      </Grid>

      {/* Columna Derecha: Formulario */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            ¡Bienvenido de vuelta!
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Correo Electronico"
              type="email"
              fullWidth
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2, mb: 2 ,backgroundColor: '#0033a0',
                '&:hover': {
                  backgroundColor: '#00237a'
                }}}
              
            >
            Inicia Sesión

            </Button>

            
          </Box>

          <Typography variant="body2" align="center">
           ¿No tienes una cuenta aun?{' '}
            <Link href="/register" underline="hover">
              Registrate
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
