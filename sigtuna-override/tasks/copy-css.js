const fs = require('fs');
const path = require('path');

const packageDirectory = path.resolve(__dirname, '..');
const files = ['sigtuna.css', 'sigtuna.css.map'];

function copyCss() {
  if (process.argv.length !== 3) {
    throw new Error('Usage: node tasks/copy-css.js <Origo build directory>');
  }

  const buildDirectory = path.resolve(packageDirectory, process.argv[2]);
  if (!fs.existsSync(buildDirectory) || !fs.statSync(buildDirectory).isDirectory()) {
    throw new Error(`Origo build directory does not exist: ${buildDirectory}. Build Origo first.`);
  }

  const sourceDirectory = path.join(packageDirectory, 'css');
  const missingFiles = files.filter(file => {
    const source = path.join(sourceDirectory, file);
    return !fs.existsSync(source) || !fs.statSync(source).isFile();
  });
  if (missingFiles.length) {
    throw new Error(`Missing generated override assets: ${missingFiles.join(', ')}. Run npm run build-sass first.`);
  }

  const destination = path.join(buildDirectory, 'sigtuna-override', 'css');
  fs.mkdirSync(destination, { recursive: true });
  files.forEach(file => fs.copyFileSync(path.join(sourceDirectory, file), path.join(destination, file)));
  console.log(`Copied Sigtuna stylesheet and source map to ${destination}`);
}

try {
  copyCss();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
