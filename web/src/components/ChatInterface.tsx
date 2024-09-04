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
    <div className={`flex flex-col ${className}`}>
      <div className="flex-grow overflow-y-auto mb-4 p-4 border rounded-lg">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-l-lg"
          placeholder="Ask for travel advice..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">Send</button>
      </form>
    </div>
  );
}