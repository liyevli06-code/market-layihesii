import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: '1',
    name: ' Alma',
    price: 2.50,
    description: 'Təzə Azərbaycan alma',
    category: ' Meyvələr',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    stock: 100,
  },
  {
    id: '2',
    name: 'Çörək',
    price: 1.20,
    description: 'Təzə toyuq əti ilə çörək',
    category: 'Qablaşdırma',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    stock: 50,
  },
  {
    id: '3',
    name: 'Süd',
    price: 3.00,
    description: '1 litr təbii süd',
    category: 'Süd məhsulları',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    stock: 80,
  },
  {
    id: '4',
    name: 'Yumurta',
    price: 5.50,
    description: '10 ədəd yumurta',
    category: 'Süd məhsulları',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    stock: 60,
  },
  {
    id: '5',
    name: 'Pomidor',
    price: 4.00,
    description: 'Təzə pomidor',
    category: 'Tərəvəzlər',
    image: 'https://images.unsplash.com/photo-1546470427-0d4db154cce8?w=400',
    stock: 45,
  },
  {
    id: '6',
    name: 'Ət',
    price: 15.00,
    description: 'Təzə mal əti',
    category: 'Ət məhsulları',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
    stock: 30,
  },
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
