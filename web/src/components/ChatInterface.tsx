"use client";

import { useState } from 'react';

export default function ChatInterface({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      // Here you would typically call an API to get the travel advice response
      setMessages(messages => [...messages, { text: "Here's some travel advice...", isUser: false }]);
      setInput('');
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
    </div>
  );
}