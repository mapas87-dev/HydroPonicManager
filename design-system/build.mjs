// Build: ESM in dist/index.js, tipi in dist/*.d.ts, CSS unico in dist/styles.css.
import { build } from 'esbuild';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { rmSync, readFileSync, writeFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
await Promise.all([
  build({
    entryPoints: ['src/index.ts'], outfile: 'dist/index.js', bundle: true, format: 'esm',
    jsx: 'automatic', target: 'es2020', external: ['react', 'react-dom', 'react/jsx-runtime'],
  }),
  promisify(exec)('npx tsc -p tsconfig.json'),
]);
writeFileSync('dist/styles.css', ['tokens', 'components'].map(f => readFileSync(`src/styles/${f}.css`, 'utf8')).join('\n'));
console.log('built dist/');
