import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/domain': resolve(__dirname, 'src/domain'),
      '@/infra': resolve(__dirname, 'src/infra'),
      '@/presentation': resolve(__dirname, 'src/presentation'),
      '@/main': resolve(__dirname, 'src/main'),
    },
  },
});
