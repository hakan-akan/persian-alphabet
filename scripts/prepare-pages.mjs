import { existsSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist', 'client');
const prefixedAssets = join(outputDirectory, 'persian-alphabet', '_next');
const publicAssets = join(outputDirectory, '_next');

if (!existsSync(join(outputDirectory, 'index.html'))) {
  throw new Error('GitHub Pages export is missing index.html.');
}

if (!existsSync(prefixedAssets)) {
  throw new Error('GitHub Pages export is missing its compiled assets.');
}

rmSync(publicAssets, { recursive: true, force: true });
renameSync(prefixedAssets, publicAssets);
rmSync(join(outputDirectory, 'persian-alphabet'), { recursive: true, force: true });
writeFileSync(join(outputDirectory, '.nojekyll'), '');
