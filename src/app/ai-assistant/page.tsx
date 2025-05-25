'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AiAssistantPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create and load the OmniDimension script
    try {
      const script = document.createElement('script');
      script.id = 'omnidimension-full-page';
      script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=e024ce438d661126ab9cd401859a8f2c';
      script.async = true;
      
      // Handle script loading success
      script.onload = () => {
        setIsLoaded(true);
        
        // Check if the OmniDimension object is available
        if (window.OmniDimension) {
          // Initialize full-page experience
          // Note: This is a hypothetical API call based on common patterns
          // You'll need to check OmniDimension's actual documentation
          window.OmniDimension.init({
            mode: 'fullpage',
            containerId: 'omnidim-container',
            theme: {
              primaryColor: '#3B82F6', // Blue to match your UI
              fontFamily: 'var(--font-geist-sans)',
            }
          });
        }
      };
      
      // Handle script loading error
      script.onerror = () => {
        setError('Failed to load OmniDimension script');
      };
      
      // Add script to document
      document.body.appendChild(script);
      
      // Cleanup function
      return () => {
        if (document.getElementById('omnidimension-full-page')) {
          document.body.removeChild(script);
        }
      };
    } catch (err) {
      setError('Error initializing OmniDimension: ' + (err instanceof Error ? err.message : String(err)));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
        <Link href="/">
          <div className="flex items-center">
            <Button variant="ghost" className="text-white hover:bg-blue-700 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Button>
            <h1 className="text-xl font-bold">Shoe Deals AI Assistant</h1>
          </div>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4">
        {error ? (
          <div className="max-w-md mx-auto mt-10 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <h2 className="font-bold mb-2">Error</h2>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4 bg-blue-600">
              Try Again
            </Button>
          </div>
        ) : !isLoaded ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading AI Assistant...</p>
          </div>
        ) : (
          <div id="omnidim-container" className="w-full h-[calc(100vh-120px)] bg-white rounded-lg shadow-lg">
            {/* OmniDimension will render here */}
          </div>
        )}
      </main>
    </div>
  );
}

// Add TypeScript declaration for OmniDimension global object
declare global {
  interface Window {
    OmniDimension?: {
      init: (config: any) => void;
    };
  }
} 