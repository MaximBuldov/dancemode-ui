import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/app',
  server: {
    port: 3000
  },
  resolve: {
    tsconfigPaths: true
  }
});
