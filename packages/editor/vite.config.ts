import { defineConfig } from 'vite';
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src', 'editor.ts'),
      name: 'Editor',
      fileName: 'editor',
    },
  },
  resolve: {
    alias: {
      '@/types': path.resolve(__dirname, 'src', 'types'),
      '@/types-internal': path.resolve(__dirname, 'src', 'types-internal'),
      '@/components': path.resolve(__dirname, 'src', 'components'),
      '@/tools': path.resolve(__dirname, 'src', 'tools'),
      '@/styles': path.resolve(__dirname, 'src', 'styles'),
    },
  },
  server: {
    port: 3303,
    open: true,
  },
  plugins: [cssInjectedByJsPlugin()],
});
