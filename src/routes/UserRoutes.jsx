// routes/UserRoutes.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Cart from "../pages/Cart";
import Menu from "../pages/Menu";
import About from "../pages/About";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

export default function UserRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
