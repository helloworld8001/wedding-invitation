import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const fontDirectory = new URL('dist/assets/fonts/', root);
const sources = await Promise.all(['dist/index.html', 'dist/app.js', 'dist/style.css'].map(path => readFile(new URL(path, root), 'utf8')));
const ascii = Array.from({ length: 95 }, (_, index) => String.fromCharCode(index + 32)).join('');
// Include dynamic messages and every digit, as well as HTML entity equivalents.
const characters = [...new Set(`${sources.join('')} ${ascii}\u00a0`.normalize('NFC'))]
  .filter(character => character.codePointAt(0) >= 32)
  .sort()
  .join('');
const latinCharacters = [...characters].filter(character => character.codePointAt(0) < 0x3000).join('');
const fonts = [
  { family: 'Noto Serif KR', query: 'Noto Serif KR:wght@400..500', name: 'noto-serif-kr', style: 'normal', weight: '400 500', text: characters },
  { family: 'Noto Sans KR', query: 'Noto Sans KR:wght@400..500', name: 'noto-sans-kr', style: 'normal', weight: '400 500', text: characters },
  { family: 'Cormorant Garamond', query: 'Cormorant Garamond:wght@400', name: 'cormorant-garamond', style: 'normal', weight: '400', text: latinCharacters },
  { family: 'Cormorant Garamond', query: 'Cormorant Garamond:ital,wght@1,400', name: 'cormorant-garamond-italic', style: 'italic', weight: '400', text: latinCharacters }
];

async function download(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' },
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`Font download failed (${response.status}): ${url}`);
  return response;
}

// Download and validate all fonts before replacing the checked-in assets.
const prepared = await Promise.all(fonts.map(async font => {
  const url = new URL('https://fonts.googleapis.com/css2');
  url.searchParams.set('family', font.query);
  url.searchParams.set('display', 'swap');
  url.searchParams.set('text', font.text);
  const css = await (await download(url)).text();
  const fontUrl = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/)?.[1];
  if (!fontUrl) throw new Error(`Expected a WOFF2 subset for ${font.family}`);
  const bytes = Buffer.from(await (await download(fontUrl)).arrayBuffer());
  if (bytes.subarray(0, 4).toString() !== 'wOF2') throw new Error(`Invalid WOFF2 file: ${font.name}`);
  const version = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  return { ...font, bytes, filename: `${font.name}.woff2`, version };
}));
const licenses = await Promise.all(['notoserifkr', 'notosanskr', 'cormorantgaramond'].map(async family => ({
  name: `${family}-OFL.txt`,
  text: await (await download(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`)).text()
})));

const fontCss = prepared.map(font => `@font-face {
  font-family: '${font.family}';
  font-style: ${font.style};
  font-weight: ${font.weight};
  font-display: swap;
  src: url('assets/fonts/${font.filename}?v=${font.version}') format('woff2');
}`).join('\n\n') + '\n';
const cssVersion = createHash('sha256').update(fontCss).digest('hex').slice(0, 12);
const fontLinks = prepared.map(font => `  <link rel="preload" href="assets/fonts/${font.filename}?v=${font.version}" as="font" type="font/woff2" crossorigin>`);
fontLinks.push(`  <link rel="stylesheet" href="fonts.css?v=${cssVersion}">`);
const marker = /  <!-- Fonts start -->[\s\S]*?  <!-- Fonts end -->/;
if (!marker.test(sources[0])) throw new Error('Missing font markers in dist/index.html');
const html = sources[0].replace(marker, `  <!-- Fonts start -->\n${fontLinks.join('\n')}\n  <!-- Fonts end -->`);

await mkdir(fontDirectory, { recursive: true });
for (const font of prepared) {
  await writeFile(new URL(font.filename, fontDirectory), font.bytes);
  console.log(`${font.filename}: ${(font.bytes.length / 1024).toFixed(1)} KiB`);
}
for (const license of licenses) await writeFile(new URL(license.name, fontDirectory), license.text);
await writeFile(new URL('dist/fonts.css', root), fontCss);
await writeFile(new URL('dist/index.html', root), html);
console.log(`Total fonts: ${(prepared.reduce((total, font) => total + font.bytes.length, 0) / 1024).toFixed(1)} KiB`);
