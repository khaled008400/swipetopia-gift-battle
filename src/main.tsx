
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Set up global error handler for logging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Set up unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Enable more detailed console logging in development
if (import.meta.env.DEV) {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  
  console.log = function(...args) {
    const timestamp = new Date().toISOString();
    originalConsoleLog.apply(console, [`[${timestamp}] info:`, ...args]);
  };
  
  console.error = function(...args) {
    const timestamp = new Date().toISOString();
    originalConsoleError.apply(console, [`[${timestamp}] error:`, ...args]);
  };
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: any) => {
          console.error('Query error:', error);
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: any) => {
          console.error('Mutation error:', error);
        }
      }
    }
  },
});

// Wrap rendering in a try-catch for error handling
try {
  root.render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
} catch (error) {
  console.error("Error rendering application:", error);
  // Render a basic error state if the app fails to load
  root.render(
    <div className="flex items-center justify-center h-screen bg-app-black text-white p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-app-yellow mb-2">Something went wrong</h1>
        <p className="mb-4">We're having trouble loading the application.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-app-yellow text-app-black px-4 py-2 rounded"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
