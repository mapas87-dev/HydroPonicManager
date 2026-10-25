// Build: ESM in dist/index.js, tipi in dist/*.d.ts, CSS unico in dist/styles.css.
import { build } from 'esbuild';
import { spawn } from 'node:child_process';
import { rmSync, readFileSync, writeFileSync } from 'node:fs';

// tsc con output sul terminale, così gli errori di tipo restano leggibili.
const tsc = () => new Promise((ok, ko) => spawn('npx', ['tsc', '-p', 'tsconfig.json'], { stdio: 'inherit' })
  .on('exit', c => (c === 0 ? ok() : ko(new Error(`tsc è uscito con codice ${c}`)))).on('error', ko));

rmSync('dist', { recursive: true, force: true });
await Promise.all([
  build({
    entryPoints: ['src/index.ts'], outfile: 'dist/index.js', bundle: true, format: 'esm',
    jsx: 'automatic', target: 'es2020', external: ['react', 'react-dom', 'react/jsx-runtime'],
  }),
  tsc(),
]);
writeFileSync('dist/styles.css', ['tokens', 'components'].map(f => readFileSync(`src/styles/${f}.css`, 'utf8')).join('\n'));
console.log('built dist/');
