
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Using true instead of "::" for better cross-platform compatibility
    host: true,
    port: 8080,
    // Adding strictPort to prevent fallback to other ports
    strictPort: false,
    // Adding hmr configuration to help with connection issues
    hmr: {
      // Using WebSockets for HMR
      protocol: 'ws',
      // Setting timeout higher for more stability
      timeout: 5000,
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Define environment variables with fallbacks for disconnected mode
  define: {
    // Provide fallback values for env variables
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'DISCONNECTED'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'DISCONNECTED'),
  }
}));
