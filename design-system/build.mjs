// Build: ESM in dist/index.js, tipi in dist/*.d.ts, CSS unico in dist/styles.css.
import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
await build({
  entryPoints: ['src/index.ts'], outfile: 'dist/index.js', bundle: true, format: 'esm',
  jsx: 'automatic', target: 'es2020', external: ['react', 'react-dom', 'react/jsx-runtime'],
});
execSync('npx tsc -p tsconfig.json', { stdio: 'inherit' });
writeFileSync('dist/styles.css', ['tokens', 'components'].map(f => readFileSync(`src/styles/${f}.css`, 'utf8')).join('\n'));
console.log('built dist/');
