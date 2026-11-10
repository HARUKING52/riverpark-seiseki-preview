import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/Users/fc3sl/.gemini/antigravity/scratch/riverpark-seiseki';
const pages = ['index.html', 'first-time/index.html', 'lounge/index.html', 'studio/index.html', 'bouldering/index.html', 'outdoorfitness-program/index.html', 'kids/index.html'];

test('all internal links across main and subpages resolve to existing files', () => {
  for (const page of pages) {
    const fullPath = path.join(root, page);
    const dir = path.dirname(fullPath);
    const html = fs.readFileSync(fullPath, 'utf8');
    const hrefRegex = /href="([^"#]+)"/g;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1];
      if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) continue;
      const target = href.startsWith('/') ? path.join(root, href) : path.join(dir, href);
      const exists = fs.existsSync(target) || fs.existsSync(path.join(target, 'index.html'));
      assert.ok(exists, `Broken link in ${page}: ${href}`);
    }
  }
});
