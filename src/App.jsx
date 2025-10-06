import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/HomePage';
import Menu from './pages/Menu';
import About from './pages/About';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Cart from './pages/Cart';
import ProductDetailsPage from './pages/ProductDetails';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import './App.css'

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}
export default App
