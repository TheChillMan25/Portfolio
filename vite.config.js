import { defineConfig } from 'vite';
import fs from 'node:fs';

export default defineConfig({
  base: '/Portfolio/',
  plugins: [
    {
      name: 'copy-static-assets',
      closeBundle() {
        if (fs.existsSync('data')) {
          fs.cpSync('data', 'dist/data', { recursive: true });
        }
        if (fs.existsSync('assets')) {
          fs.cpSync('assets', 'dist/assets', { recursive: true });
        }
      }
    }
  ]
});