
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Wrap rendering in a try-catch for error handling
try {
  root.render(<App />);
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
