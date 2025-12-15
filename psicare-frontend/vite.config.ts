import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite do aviso para 1000kb (opcional, para silenciar warnings menores)
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separa bibliotecas do node_modules em chunks individuais ou agrupados
          if (id.includes('node_modules')) {
            
            // Core do React
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }

            // Bibliotecas de UI e Utilitários pesados
            if (id.includes('lucide-react') || id.includes('date-fns')) {
              return 'vendor-ui';
            }

            // Bibliotecas de Formulário
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'vendor-form';
            }

            // Qualquer outra biblioteca do node_modules vai para um chunk genérico 'vendor'
            return 'vendor';
          }
        },
      },
    },
  },
});