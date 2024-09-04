"use client";

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  title: string;
  brief: string;
  imageUrl: string;
  link: string;
}

export default function ProductInfo({ className }: { className?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://your-fastapi-url/api/initial-products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={`${className} p-4 text-center`}>Loading products...</div>;
  }

  if (error) {
    return <div className={`${className} p-4 text-center text-red-600`}>{error}</div>;
  }

  return (
    <div className={`${className} p-4 border border-red-300 rounded-lg bg-red-50 overflow-y-auto`}>
      <h2 className="text-xl font-semibold mb-4 text-red-700">Related Products</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="border border-red-200 rounded-lg p-3 bg-white">
            <img 
              src={product.imageUrl} 
              alt={product.title}
              className="rounded-lg w-full h-32 object-cover mb-2"
            />
            <h3 className="text-md font-semibold text-red-800 mb-1">{product.title}</h3>
            <p className="text-red-800 text-xs mb-2">{product.brief}</p>
            <a 
              href={product.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition-colors"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}