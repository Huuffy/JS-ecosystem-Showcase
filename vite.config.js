import { defineConfig } from 'vite';
import { resolve, dirname, relative, join } from 'path';
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

// Custom plugin to copy sub-project source files that Babel loads at runtime
function copySubProjectSources() {
  return {
    name: 'copy-sub-project-sources',
    closeBundle() {
      const subProjects = [
        'frameworks/react/projects/social-feed/src',
        'frameworks/react/projects/ecommerce-catalog/src',
        'frameworks/react/projects/video-streaming/src',
        'frameworks/react/projects/collaborative-editor/src',
        'frameworks/mern-stack/projects/multi-tenant-support/assets',
        'frameworks/mern-stack/projects/document-management/assets',
        'frameworks/mern-stack/projects/erp-system/assets',
        'frameworks/mern-stack/projects/blockchain-supply/assets',
      ];

      // Also copy the root assets directory for absolute-path references
      const staticDirs = [
        'assets',
      ];

      for (const subDir of subProjects) {
        const srcPath = resolve(__dirname, subDir);
        const destPath = resolve(__dirname, 'dist', subDir);
        if (fs.existsSync(srcPath)) {
          copyDirSync(srcPath, destPath);
          console.log(`  Copied: ${subDir}`);
        }
      }

      for (const dir of staticDirs) {
        const srcPath = resolve(__dirname, dir);
        const destPath = resolve(__dirname, 'dist', dir);
        if (fs.existsSync(srcPath)) {
          copyDirSync(srcPath, destPath);
          console.log(`  Copied static: ${dir}`);
        }
      }
    }
  };
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig({
  plugins: [copySubProjectSources()],
  build: {
    rollupOptions: {
      input: getHtmlPages(__dirname)
    }
  }
});
