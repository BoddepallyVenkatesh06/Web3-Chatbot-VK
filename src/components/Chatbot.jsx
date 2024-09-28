import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = 'https://llamatool.us.gaianet.network/v1';
  const LLM_MODEL_NAME = 'llama';
  const API_KEY = ''; // Empty string or any value

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { text: input, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/completions`, {
        model: LLM_MODEL_NAME,
        messages: [{ role: 'user', content: input }],
        max_tokens: 150,
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
        },
      });

      const botResponse = response.data.choices[0].message.content.trim();
      setMessages(prevMessages => [...prevMessages, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Sorry, I encountered an error.', isUser: false }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 text-xl font-bold shadow-md">
        Web3 Chatbot
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${
                message.isUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800'
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.isUser ? 'You' : 'Chatbot'}
              </p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white shadow-md">
              <p className="text-sm font-semibold mb-1">Chatbot</p>
              <p className="text-gray-600">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
