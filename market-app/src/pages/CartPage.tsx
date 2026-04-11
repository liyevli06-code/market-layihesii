import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Səbət boşdur</h2>
          <p className="text-gray-500 mb-6">Elə indi alış-verişə başlayın!</p>
          <Link
            to="/"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition"
          >
            Marketə get
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Səbət</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Hamısını sil
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Məhsul';
                  }}
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                  <p className="text-green-600 font-bold mt-1">{item.price.toFixed(2)} ₼</p>
                </div>

                <div className="flex flex-col items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">{(item.price * item.quantity).toFixed(2)} ₼</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Sifariş özeti</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Məhsullar ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>{totalPrice.toFixed(2)} ₼</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Çatdırılma</span>
                  <span className="text-green-500">Pulsuz</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Cəmi</span>
                  <span>{totalPrice.toFixed(2)} ₼</span>
                </div>
              </div>

              <button className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">
                Ödənişə keç
              </button>

              <Link
                to="/"
                className="block text-center text-green-500 hover:text-green-600 mt-4 font-medium"
              >
                Alış-verişə davam et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
