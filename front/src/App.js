// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Payments from './pages/Payments';
import PaymentDetail from './pages/PaymentDetail';
import Refunds from './pages/Refunds';
import RefundDetail from './pages/RefundDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Pagos */}
      <Route
        path="/payments"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Payments />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/payments/:id"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <PaymentDetail />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Reembolsos */}
      <Route
        path="/refunds"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Refunds />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/refunds/:id"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <RefundDetail />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
