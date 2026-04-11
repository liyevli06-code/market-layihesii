import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <header className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold hover:text-green-100">
            <Store className="w-8 h-8" />
            <span>Mənim Marketim</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                location.pathname === '/'
                  ? 'bg-green-700'
                  : 'hover:bg-green-500'
              }`}
            >
              <Store className="w-5 h-5" />
              <span>Market</span>
            </Link>

            <Link
              to="/cart"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                location.pathname === '/cart'
                  ? 'bg-green-700'
                  : 'hover:bg-green-500'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Səbət</span>
              {totalItems > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}