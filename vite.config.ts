import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  test: {
    include: ['src/back-end/**/*.test.ts'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
});
