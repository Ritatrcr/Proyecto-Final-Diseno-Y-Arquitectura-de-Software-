// src/layouts/DashboardLayout.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import SendToMobileIcon from '@mui/icons-material/SendToMobile';
import HelpIcon from '@mui/icons-material/Help';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

// Ajusta estos colores según tu marca o la paleta de la imagen
const BRAND_BLUE = '#0033a0'; // Azul corporativo para fondo de la barra lateral
const HIGHLIGHT_BLUE = '#3366FF'; // Azul alterno, si deseas usarlo

function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Opciones del menú lateral
  const menuItems = [
    { text: 'Home', route: '/', icon: <AccountBalanceIcon /> },
    { text: 'Pagos', route: '/payments', icon: <PaymentsIcon /> },
    { text: 'Reembolsos', route: '/refunds', icon: <SendToMobileIcon /> },
    { text: 'Finanzas', route: '/finanzas', icon: <TrendingUpIcon /> },
    { text: 'Ayuda', route: '/ayuda', icon: <HelpIcon /> }
  ];

  // Drawer: barra lateral
  const drawer = (
    <div style={{ height: '100%' }}>
      {/* Encabezado dentro del Drawer */}
      <Toolbar sx={{ bgcolor: '#fff', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ color: BRAND_BLUE, fontWeight: 'bold' }}>
          BancaPro
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ bgcolor: BRAND_BLUE, height: '100%' }}>
      {menuItems.map((item, index) => {
  const isActive = location.pathname === item.route;
  return (
    <ListItem disablePadding key={index}>
      <ListItemButton
        component={Link}
        to={item.route}
        sx={{
          backgroundColor: isActive ? '#fff' : 'transparent',
          color: isActive ? BRAND_BLUE : '#fff',
          margin: '4px 8px',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.2)',
            color: '#fff'
          }
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? BRAND_BLUE : '#fff',
            minWidth: '40px'
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          sx={{
            color: isActive ? BRAND_BLUE : '#fff',
            fontWeight: isActive ? 'bold' : 'normal'
          }}
        />
      </ListItemButton>
    </ListItem>
  );
})}

      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Barra Superior */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#fff',
          color: BRAND_BLUE,
          boxShadow: 1
        }}
      >
        <Toolbar>
          {/* Botón de menú en móvil */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Saludo al usuario */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user
              ? `Bienvenido, ${user.username ? user.username : user.email}`
              : 'Bienvenido'}
          </Typography>

          {/* Botón Salida Segura (a la derecha) */}
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderColor: '#c0392b',
              color: '#c0392b',
              '&:hover': { borderColor: '#e74c3c', color: '#e74c3c' }
            }}
          >
            Salida segura
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="menu lateral"
      >
        {/* Drawer para móvil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
        {/* Drawer permanente en escritorio */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
