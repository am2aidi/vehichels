const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('Building Huranow Motors distribution bundle...');

// Remove existing dist if present
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

// Files to copy
const filesToCopy = ['index.html', 'manifest.json', 'sw.js', 'favicon.ico', 'favicon.svg', 'apple-touch-icon.png'];
filesToCopy.forEach((file) => {
  const srcPath = path.join(rootDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
  }
});

// Directories to copy
const dirsToCopy = ['css', 'js', 'assets', 'public', 'icons'];
dirsToCopy.forEach((dir) => {
  const srcPath = path.join(rootDir, dir);
  if (fs.existsSync(srcPath)) {
    copyRecursiveSync(srcPath, path.join(distDir, dir));
  }
});

console.log('Build completed successfully! Dist folder ready at:', distDir);
