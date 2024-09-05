"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatInterface from './ChatInterface';
import ProductInfo, { Product } from './ProductInfo';

export default function ChatAndProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialProducts();
  }, []);

  const fetchInitialProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/initial-products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial products:', error);
      setLoading(false);
    }
  };

  const updateRelatedProducts = (newProducts: Product[]) => {
    if (newProducts.length > 0) {
      setProducts(newProducts);
    }
  };

  return (
    <div className="flex">
      <ChatInterface 
        className="w-1/2 p-4" 
        updateRelatedProducts={updateRelatedProducts} 
      />
      <ProductInfo 
        className="w-1/2 p-4" 
        products={products}
        loading={loading}
      />
    </div>
  );
}