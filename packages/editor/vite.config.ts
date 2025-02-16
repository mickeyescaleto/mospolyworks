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
      '@repo/editor/types': path.resolve(__dirname, 'src', 'types'),
      '@repo/editor/types-internal': path.resolve(
        __dirname,
        'src',
        'types-internal',
      ),
      '@repo/editor/components': path.resolve(__dirname, 'src', 'components'),
      '@repo/editor/tools': path.resolve(__dirname, 'src', 'tools'),
      '@repo/editor/styles': path.resolve(__dirname, 'src', 'styles'),
    },
  },
  server: {
    port: 3303,
    open: true,
  },
  plugins: [cssInjectedByJsPlugin()],
});
