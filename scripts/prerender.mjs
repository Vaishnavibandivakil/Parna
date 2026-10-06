import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'vite';

const output = resolve('dist/index.html');
const marker = '<div id="root"></div>';
const serverOutput = await mkdtemp(resolve('node_modules/.parna-prerender-'));

try {
  await build({
    logLevel: 'silent',
    build: { ssr: resolve('src/App.tsx'), outDir: serverOutput, emptyOutDir: true, copyPublicDir: false },
  });
  const { default: App } = await import(pathToFileURL(join(serverOutput, 'App.js')).href);
  const page = React.createElement(React.StrictMode, null, React.createElement(App));
  // React preloads every eager image during server rendering. Keep only the
  // explicit high-priority hero preload in index.html; the rest can load later.
  const content = renderToString(page).replace(/<link\b(?=[^>]*\brel="preload")(?=[^>]*\bas="image")[^>]*\/?\s*>/g, '');
  const html = await readFile(output, 'utf8');
  if (!html.includes(marker)) throw new Error('Missing root element in built HTML');
  await writeFile(output, html.replace(marker, `<div id="root">${content}</div>`));
  process.stdout.write(`Prerendered home page (${content.length} HTML characters).\n`);
} finally {
  await rm(serverOutput, { recursive: true, force: true });
}
