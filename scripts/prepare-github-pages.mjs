import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// configure-pages supplies the actual URL, including the repository path or custom domain.
const input = process.env.PAGES_BASE_URL || process.argv[2];
if (!input) throw new Error('Pass the published Pages URL: npm run build:pages -- https://USERNAME.github.io/REPOSITORY/');
const baseUrl = new URL(input);
if (!['http:', 'https:'].includes(baseUrl.protocol) || baseUrl.username || baseUrl.password || baseUrl.search || baseUrl.hash) {
  throw new Error('The Pages URL must be an HTTP(S) site URL without credentials, query, or fragment.');
}
baseUrl.pathname = baseUrl.pathname.replace(/\/+$/, '') + '/';

const source = fileURLToPath(new URL('../dist/', import.meta.url));
const output = fileURLToPath(new URL('../.artifacts/github-pages/', import.meta.url));
const escapeAttribute = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
for (const [property, value] of [
  ['og:url', baseUrl.href],
  ['og:image', new URL('assets/wedding.jpg', baseUrl).href]
]) {
  const pattern = new RegExp(`<meta property="${property}" content="[^"]*">`, 'g');
  if ([...html.matchAll(pattern)].length !== 1) throw new Error(`Expected one ${property} metadata tag.`);
  html = html.replace(pattern, () => `<meta property="${property}" content="${escapeAttribute(value)}">`);
}

// Keep the source and the current hosting configuration untouched by this build.
await mkdir(new URL('../.artifacts/', import.meta.url), { recursive: true });
await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
await writeFile(new URL('../.artifacts/github-pages/index.html', import.meta.url), html);
await writeFile(new URL('../.artifacts/github-pages/.nojekyll', import.meta.url), '');
console.log(`GitHub Pages files: ${output}\nPublished URL: ${baseUrl.href}`);
