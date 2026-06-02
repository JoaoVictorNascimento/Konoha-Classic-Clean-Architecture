import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main/index.ts'),
      name: 'KonohaDomain',
      fileName: 'konoha-domain',
    },
  },
  resolve: {
    alias: {
      '@/domain': resolve(__dirname, 'src/domain'),
      '@/infra': resolve(__dirname, 'src/infra'),
    },
  },
});
