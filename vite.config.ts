
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
    strictPort: false,
    hmr: {
      protocol: 'ws',
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
  define: {
    // Simple fallbacks to prevent errors when env vars are missing
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('DISCONNECTED'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('DISCONNECTED'),
  }
}));
