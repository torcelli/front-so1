import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const config = {
    plugins: [react()],
    preview: {
      port: 8081,
      strictPort: true,
    },
    server: {
      port: 8081,
      proxy: {
        '/frontend-app': 'http://localhost:8080',
      },
    },
  };
  return defineConfig(config);
};