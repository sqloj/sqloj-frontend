import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'http://124.221.134.229:10086/',
        changeOrigin: true
      },
      '/mapi': {
        target: 'http://124.221.134.229:10086/',
        changeOrigin: true
      }
    }
  },
  plugins: [vue()]
});
