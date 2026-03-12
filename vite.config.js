import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getHtmlPages(dir) {
  let pages = {};
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== 'dist' && !file.name.startsWith('.')) {
      Object.assign(pages, getHtmlPages(resolve(dir, file.name)));
    } else if (file.name.endsWith('.html')) {
        // Create unique names like 'frameworks_react_index'
      const name = resolve(dir, file.name)
        .replace(__dirname, '')
        .replace(/\\/g, '/')
        .substring(1)
        .replace('.html', '')
        .replace(/\//g, '_');
        
      pages[name || 'main'] = resolve(dir, file.name);
    }
  }
  return pages;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: getHtmlPages(__dirname)
    }
  }
});
