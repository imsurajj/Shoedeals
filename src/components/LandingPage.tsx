'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ChatInterface';
import { VoiceCall } from '@/components/VoiceCall';
import Link from 'next/link';

export function LandingPage() {
  const [activeInterface, setActiveInterface] = useState<'none' | 'chat' | 'call'>('none');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {activeInterface === 'none' && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-blue-900 mb-6 tracking-tight">Find Your Perfect Shoes</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI assistant helps you discover the best shoe deals within your budget. 
              Get personalized recommendations tailored to your style.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-2xl mx-auto animate-slide-up">
            <Button 
              onClick={() => setActiveInterface('chat')}
              className="w-full md:w-auto text-lg py-8 px-10 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Talk to Agent
            </Button>
            <Button 
              onClick={() => setActiveInterface('call')}
              className="w-full md:w-auto text-lg py-8 px-10 bg-green-600 hover:bg-green-700 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Call Agent
            </Button>
            <Link href="/ai-assistant" className="w-full md:w-auto">
              <Button 
                className="w-full text-lg py-8 px-10 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Full-Page AI Experience
              </Button>
            </Link>
          </div>
          
          <div className="mt-24 text-center">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Tell Us Your Preferences</h3>
                <p className="text-gray-600">Share your style, size, and budget with our AI assistant</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Get Recommendations</h3>
                <p className="text-gray-600">Our AI finds the perfect shoes matching your criteria</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Find Great Deals</h3>
                <p className="text-gray-600">Discover the best prices from trusted retailers</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeInterface === 'chat' && (
        <div className="h-screen flex flex-col">
          <div className="bg-blue-600 text-white p-4 flex items-center">
            <Button 
              onClick={() => setActiveInterface('none')}
              variant="ghost"
              className="text-white hover:bg-blue-700 mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Button>
            <h2 className="text-xl font-medium">Shoe Deals Assistant</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      )}

      {activeInterface === 'call' && (
        <div className="h-screen flex flex-col">
          <div className="bg-green-600 text-white p-4 flex items-center">
            <Button 
              onClick={() => setActiveInterface('none')}
              variant="ghost"
              className="text-white hover:bg-green-700 mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Button>
            <h2 className="text-xl font-medium">Voice Call with Assistant</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <VoiceCall />
          </div>
        </div>
      )}
    </div>
  );
} 