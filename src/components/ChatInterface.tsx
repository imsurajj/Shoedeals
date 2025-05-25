'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getShoeDeals } from '@/utils/shoeDealsData';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  shoeDeals?: any[];
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hi there! I can help you find the perfect shoes within your budget. What price range are you looking for?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Extract budget from message
      const budgetMatch = input.match(/\$?(\d+)/);
      const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;
      
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          budget
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // If budget was detected, fetch shoe deals
      let shoeDeals: any[] | undefined;
      if (budget) {
        shoeDeals = getShoeDeals(budget);
      }
      
      // Add assistant message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        shoeDeals
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center mb-2">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    A
                  </div>
                  <div className="font-medium">Shoe Assistant</div>
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Improved Shoe Deals Display */}
              {message.shoeDeals && message.shoeDeals.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-blue-700 mb-2 text-lg">Available Options:</h3>
                  <div className="grid gap-3">
                    {message.shoeDeals.map((deal, i) => (
                      <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center p-3 border-b border-gray-100">
                          <div className="font-medium text-gray-800">{deal.store}</div>
                          <div className="font-bold text-green-600">${deal.price}</div>
                        </div>
                        <div className="p-3 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${deal.inStock ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                            <span className="text-sm text-gray-600">{deal.inStock ? 'In stock' : 'Out of stock'}</span>
                          </div>
                          <div className="text-sm text-gray-600">Delivery: {deal.deliveryDays} days</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 