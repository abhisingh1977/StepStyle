import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import RewardsPage from './pages/RewardsPage';
import OrdersPage from './pages/OrdersPage';
import DealsPage from './pages/DealsPage';
import ProductDetailPage from './pages/ProductDetailPage';

function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Navbar />
      <main className={`flex-1 ${user ? 'pt-16' : ''}`}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/shop/men" replace /> : <LandingPage />} />
          <Route path="/shop/:category" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={user ? <Navigate to="/shop/men" replace /> : <LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/deals" element={<DealsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
