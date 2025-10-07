import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import authService from "./lib/authService";

// Pages
import Home from './pages/HomePage';
import Menu from './pages/Menu';
import About from './pages/About';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Cart from './pages/Cart';
import ProductDetailsPage from './pages/ProductDetails';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminReports from './pages/admin/Reports';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';

// Components
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import { AdminLayout } from './components/layout/admin-layout';
import ProtectedRoute from './routes/ProtectedRoute';
import { Toaster } from 'sonner';
import './App.css';

// Component cho Customer Routes
const CustomerApp = () => (
  <div>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={
        <ProtectedRoute role="customer">
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute role="customer">
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute role="customer">
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute role="customer">
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </div>
);

// Component cho Admin Routes
const AdminApp = () => (
  <Routes>
    <Route path="/admin/*" element={
      <ProtectedRoute role="admin">
        <AdminLayout>
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </AdminLayout>
      </ProtectedRoute>
    } />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
  </Routes>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra user khi app khởi động
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Lắng nghe thay đổi authentication state
    const handleStorageChange = (e) => {
      // Only update if it's related to auth tokens
      if (e?.key === 'token' || e?.key === 'user' || !e?.key) {
        const updatedUser = authService.getCurrentUser();
        setUser(updatedUser);
      }
    };

    // Lắng nghe custom auth events
    const handleAuthChange = () => {
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
    };

    // Lắng nghe sự kiện storage change để update state khi user login/logout
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" richColors expand={true} />

      {/* Routing dựa trên role */}
      {user?.roles?.includes('admin') ? (
        <AdminApp />
      ) : (
        <CustomerApp />
      )}
    </div>
  );
}

export default App;
