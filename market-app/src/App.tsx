import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ShoppingPage from './pages/ShoppingPage';
import CartPage from './pages/CartPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/admin2007" element={<AdminLogin />} />
              <Route path="/admin2007/dashboard" element={<><Header /><AdminDashboard /></>} />
              <Route path="/*" element={<><Header /><Routes>
                <Route path="/" element={<ShoppingPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes></>} />
            </Routes>
          </div>
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;