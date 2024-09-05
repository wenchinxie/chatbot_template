"use client";

import { useState } from 'react';
import axios from 'axios'; // Make sure to install axios: npm install axios
import { Product } from './ProductInfo'; // Import the Product type

interface ChatInterfaceProps {
  className?: string;
  updateRelatedProducts: (products: Product[]) => void;
}

export default function ChatInterface({ className, updateRelatedProducts }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [relatedProducts, setRelatedProductsState] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');

      try {
        const response = await axios.post('http://localhost:8000/api/chat', { message: input });
        const { reply, products } = response.data;

        setMessages(messages => [...messages, { text: reply, isUser: false }]);
        
        if (products && products.length > 0) {
          updateRelatedProducts(products);
        }
      } catch (error) {
        console.error('Error fetching chat response:', error);
        setMessages(messages => [...messages, { text: "Sorry, there was an error processing your request.", isUser: false }]);
      }
    }
  };

  return (
    <div className={`flex flex-col ${className} border border-red-300 rounded-lg`}>
      <div className="flex-grow overflow-y-auto mb-4 p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 bg-red-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border border-red-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Ask for travel advice..."
        />
        <button type="submit" className="bg-red-600 text-white p-2 rounded-r-lg hover:bg-red-700 transition-colors">Send</button>
      </form>
      
      {relatedProducts.length > 0 && (
        <div className="mt-4 p-4 bg-red-50">
          <h3 className="font-bold text-red-800 mb-2">Related Products:</h3>
          <ul className="list-disc list-inside">
            {relatedProducts.map((product, index) => (
              <li key={index} className="text-red-600">{product}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}