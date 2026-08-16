import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import { fileURLToPath, URL } from 'node:url';

/**
 * The compiled Compact contract lives at ../managed (symlinked into frontend),
 * so its `import '@midnight-ntwrk/compact-runtime'` resolves to the repo-root
 * node_modules copy, while the app resolves the frontend copy. That bundles
 * TWO copies of the (WASM-backed) onchain runtime and breaks `instanceof`
 * identity inside the generated `ledger()` (throws "expected instance of
 * _ChargedState"). These aliases force every import to a single copy.
 */
function frontendModule(relative: string): string {
  return fileURLToPath(new URL(relative, import.meta.url));
}

export default defineConfig({
  resolve: {
    alias: {
      '@midnight-ntwrk/compact-runtime': frontendModule(
        'node_modules/@midnight-ntwrk/compact-runtime'
      ),
      '@midnight-ntwrk/onchain-runtime-v3': frontendModule(
        'node_modules/@midnight-ntwrk/onchain-runtime-v3'
      ),
    },
  },
  build: {
    target: 'esnext',
  },
  plugins: [
    react(),
    wasm(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
