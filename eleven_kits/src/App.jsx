import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCategories from './pages/AdminCategories';
import InfoPage from './pages/InfoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
        <Route path="/categoria/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
        <Route path="/producto/:id" element={<ProductPage />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/pedido-confirmado/:id" element={<OrderConfirmation />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/productos" element={<AdminProducts />} />
        <Route path="/admin/pedidos" element={<AdminOrders />} />
        <Route path="/admin/categorias" element={<AdminCategories />} />
        <Route path="/informacion" element={<InfoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;