import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HouseIcon from '@mui/icons-material/House';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShieldIcon from '@mui/icons-material/Shield';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f8fd', minHeight: '100vh' }}>
      {/* Saludo */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        ¡Hola, {user?.username || user?.email}!
      </Typography>

      {/* ¿Qué necesitas hacer hoy? */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          ¿Qué necesitas hacer hoy?
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            sx={{ borderRadius: 2, borderStyle: 'dashed' }}
          >
            Recargar celular
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: 2, borderStyle: 'dashed' }}
          >
            Inscribir servicios
          </Button>
        </Stack>
        <Typography variant="body2" sx={{ mt: 2, color: '#777' }}>
          Visualiza aquí tus próximas facturas por pagar
        </Typography>
      </Paper>

      {/* Puedes consultar */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Puedes consultar
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<PaymentIcon />}
            sx={{ borderRadius: 2 }}
          >
            Últimos Pagos
          </Button>
          <Button
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            sx={{ borderRadius: 2 }}
          >
            Últimas transferencias
          </Button>
        </Stack>
      </Paper>

      {/* Ahorra y alcanza tus sueños */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Ahorra y alcanza tus sueños
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ borderRadius: 2, borderStyle: 'dashed' }}
          >
            Crear Alcancía
          </Button>
          <Button variant="outlined" sx={{ borderRadius: 2 }}>
            Cargar mis alcancías
          </Button>
        </Stack>
      </Paper>

      {/* Te recomendamos */}
      

        {/* Botones de servicios */}
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            {[
              { label: 'Crédito de libre inversión', icon: <AccountBalanceIcon /> },
              { label: 'Crédito de libranza', icon: <AccountBalanceIcon /> },
              { label: 'Tarjeta de crédito', icon: <CreditCardIcon /> },
              { label: 'Crédito de vivienda', icon: <HouseIcon /> },
              { label: 'Compra de cartera', icon: <LocalOfferIcon /> },
              { label: 'Seguros', icon: <ShieldIcon /> },
            ].map((item, i) => (
              <Grid item xs={6} sm={4} key={i}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={item.icon}
                  sx={{
                    borderRadius: 2,
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontWeight: '500',
                    height: 60
                  }}
                >
                  {item.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      
    </Box>
  );
};

export default Home;
