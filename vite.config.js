import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { handleApiRequest } from './server/api.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'finora-backend-api-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            handleApiRequest(req, res);
          } else {
            next();
          }
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            handleApiRequest(req, res);
          } else {
            next();
          }
        });
      },
    },
  ],
});
