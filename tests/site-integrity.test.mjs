import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/Users/fc3sl/.gemini/antigravity/scratch/riverpark-seiseki';
const pages = [
  'index.html',
  'concept/index.html',
  'first-time/index.html',
  'lounge/index.html',
  'program/index.html',
  'instructor/index.html',
  'plan/index.html',
  'access/index.html',
  'studio/index.html',
  'bouldering/index.html',
  'outdoorfitness-program/index.html',
  'kids/index.html'
];

test('all internal links across main and subpages resolve to existing files', () => {
  for (const page of pages) {
    const fullPath = path.join(root, page);
    if (!fs.existsSync(fullPath)) {
      assert.fail(`Page ${page} does not exist`);
    }
    const dir = path.dirname(fullPath);
    const html = fs.readFileSync(fullPath, 'utf8');
    const hrefRegex = /href="([^"#]+)"/g;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1];
      if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:')) continue;
      const target = href.startsWith('/') ? path.join(root, href) : path.resolve(dir, href);
      const exists = fs.existsSync(target) || fs.existsSync(path.join(target, 'index.html'));
      assert.ok(exists, `Broken link in ${page}: ${href} -> ${target}`);
    }
  }
});

test('all local media references (img src, video src, poster) across main and subpages exist on disk', () => {
  for (const page of pages) {
    const fullPath = path.join(root, page);
    if (!fs.existsSync(fullPath)) continue;
    const dir = path.dirname(fullPath);
    const html = fs.readFileSync(fullPath, 'utf8');

    // img tags
    const imgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      if (src.startsWith('http')) continue;
      const target = src.startsWith('/') ? path.join(root, src) : path.resolve(dir, src);
      assert.ok(fs.existsSync(target), `Broken img src in ${page}: ${src} -> ${target}`);
      assert.ok(!match[0].includes('alt=""'), `Missing alt attribute in ${page}: ${match[0]}`);
    }

    // video tags
    const videoRegex = /<video\s+[^>]*src="([^"]+)"[^>]*>/g;
    while ((match = videoRegex.exec(html)) !== null) {
      const src = match[1];
      if (src.startsWith('http')) continue;
      const target = src.startsWith('/') ? path.join(root, src) : path.resolve(dir, src);
      assert.ok(fs.existsSync(target), `Broken video src in ${page}: ${src} -> ${target}`);
    }

    // poster
    const posterRegex = /poster="([^"]+)"/g;
    while ((match = posterRegex.exec(html)) !== null) {
      const poster = match[1];
      if (poster.startsWith('http')) continue;
      const target = poster.startsWith('/') ? path.join(root, poster) : path.resolve(dir, poster);
      assert.ok(fs.existsSync(target), `Broken poster in ${page}: ${poster} -> ${target}`);
    }
  }
});
