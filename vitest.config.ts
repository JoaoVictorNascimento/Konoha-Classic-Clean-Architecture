import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    environmentMatchGlobs: [
      ['tests/presentation/pages/**', 'jsdom'],
      ['tests/presentation/components/**', 'jsdom'],
    ],
    setupFiles: ['tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@/domain': resolve(__dirname, 'src/domain'),
      '@/infra': resolve(__dirname, 'src/infra'),
      '@/presentation': resolve(__dirname, 'src/presentation'),
      '@/main': resolve(__dirname, 'src/main'),
    },
  },
});
