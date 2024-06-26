/* eslint-disable import/no-default-export */
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for resolving paths
    },
  },
  build: {
    // Use this path in your Express server
    outDir: '../dist/client',
  },
});
