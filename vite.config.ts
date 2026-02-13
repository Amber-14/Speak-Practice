import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/Speak-Practice/',
      build: {
        outDir: 'docs'
      },

      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify('AIzaSyC9X9HJWRpZy1OtH9xW9txffN7EJzxtW_U'),
        'process.env.GEMINI_API_KEY': JSON.stringify('AIzaSyC9X9HJWRpZy1OtH9xW9txffN7EJzxtW_U')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
