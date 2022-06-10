import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import externalGlobals from 'rollup-plugin-external-globals';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true,
    proxy: {
      '/api': {
        // target: 'http://192.168.212.82:10086/',
        target: 'http://124.221.134.229:10086/',
        changeOrigin: true
      },
      '/mapi': {
        // target: 'http://192.168.212.82:10086/',
        target: 'http://124.221.134.229:10086/',
        changeOrigin: true
      }
    }
  },
  plugins: [vue()],
  build: {
    rollupOptions: {
      external: ['highlight.js', 'markdown-it', 'monaco-editor'],
      plugins: [
        externalGlobals({
          'highlight.js': 'hljs',
          'markdown-it': 'markdownit',
          'monaco-editor': 'monaco'
        })
      ]
    }
  }
});
