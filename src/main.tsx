
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

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
    },
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
