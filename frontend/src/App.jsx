import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { MyOrders } from './pages/MyOrders';
import { VendorProducts } from './pages/VendorProducts';
import { VendorOrders } from './pages/VendorOrders';
import { GrievanceDetails } from './pages/GrievanceDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { AdminUsers } from './pages/AdminUsers';
import { AdminVendors } from './pages/AdminVendors';
import { AdminOrders } from './pages/AdminOrders';
import { AdminGrievances } from './pages/AdminGrievances';
import { UserReport } from './pages/UserReport';
import { ProductReport } from './pages/ProductReport';
import { OrderReport } from './pages/OrderReport';
import { TransactionReport } from './pages/TransactionReport';
import { Wishlist } from './pages/Wishlist';
import Wallet from './pages/Wallet';
import './App.css';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute requiredRole="customer">
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/wallet"
            element={
              <ProtectedRoute allowedRoles={["customer", "vendor"]}>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* Vendor Routes */}
          <Route
            path="/my-products"
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor-orders"
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grievances/:id"
            element={
              <ProtectedRoute>
                <GrievanceDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminVendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/grievances"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminGrievances />
              </ProtectedRoute>
            }
          />

          {/* Reports Routes */}
          <Route
            path="/reports/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/products"
            element={
              <ProtectedRoute requiredRole="admin">
                <ProductReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/orders"
            element={
              <ProtectedRoute requiredRole="admin">
                <OrderReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/transactions"
            element={
              <ProtectedRoute requiredRole="admin">
                <TransactionReport />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
