import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const pages = [
  {
    path: 'concept/index.html',
    minSections: 6,
    mustInclude: [
      'わたしと自然が心地よくつながる毎日を、ここから。',
      '08:00',
      '19:30',
      'Dd84ReqzZLA',
      'rp-grid-3',
      'riverpark_3rd_anniv.mp4',
      'first-time',
    ],
  },
  {
    path: 'lounge/index.html',
    minSections: 6,
    mustInclude: [
      'WORK LOUNGE',
      '多摩川',
      '2F ヨガスタジオ（約100㎡）',
      '2F 会員制ワークラウンジ',
      '1F ボルダリングジム',
      'ロッカー＆シャワールーム',
      '1F SUP艇庫（多摩川直結）',
      'クラブハウス・レンタル対応',
      'img_1f.jpg',
      'img_2f.jpg',
      'Wi-Fi',
      'シャワー',
      'rp-grid-3',
      'rentalservice',
    ],
  },
  {
    path: 'plan/index.html',
    minSections: 6,
    mustInclude: [
      '13,612円',
      '3,850円',
      '1,980円',
      '7,480円',
      'tabindex="0"',
      'role="region"',
      'rp-grid-3',
      'rsvprime.nas-club.co.jp',
    ],
  },
  {
    path: 'access/index.html',
    minSections: 5,
    mustInclude: [
      '聖蹟桜ヶ丘駅',
      '徒歩5分',
      '一ノ宮1-26-1',
      '平日 9:00-22:00',
      'rp-grid-3',
      'maps/embed',
    ],
  },
];

test('concept, lounge, plan, and access dedicated pages exist and each contain at least 5 substantive sections and .rp-grid-3', () => {
  for (const p of pages) {
    assert.ok(fs.existsSync(p.path), `Expected ${p.path} to exist`);
    const html = fs.readFileSync(p.path, 'utf8');
    const sectionCount = (html.match(/<section\b/g) || []).length;
    assert.ok(sectionCount >= p.minSections, `Expected ${p.path} to have >= ${p.minSections} sections, found ${sectionCount}`);
    for (const token of p.mustInclude) {
      assert.ok(html.includes(token), `Expected ${p.path} to include "${token}"`);
    }
  }
});

test('all local media references (img/video) in dedicated pages exist on disk', () => {
  for (const p of pages) {
    if (!fs.existsSync(p.path)) continue;
    const html = fs.readFileSync(p.path, 'utf8');
    const dir = path.dirname(p.path);

    // img tags
    const imgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      if (src.startsWith('http')) continue;
      const resolved = src.startsWith('/') ? path.join(process.cwd(), src) : path.resolve(dir, src);
      assert.ok(fs.existsSync(resolved), `Broken img src in ${p.path}: ${src} -> ${resolved}`);
      assert.ok(!match[0].includes('alt=""'), `Missing alt attribute in ${p.path}: ${match[0]}`);
    }

    // video tags
    const videoRegex = /<video\s+[^>]*src="([^"]+)"[^>]*>/g;
    while ((match = videoRegex.exec(html)) !== null) {
      const src = match[1];
      if (src.startsWith('http')) continue;
      const resolved = src.startsWith('/') ? path.join(process.cwd(), src) : path.resolve(dir, src);
      assert.ok(fs.existsSync(resolved), `Broken video src in ${p.path}: ${src} -> ${resolved}`);
    }

    const posterRegex = /poster="([^"]+)"/g;
    while ((match = posterRegex.exec(html)) !== null) {
      const poster = match[1];
      if (poster.startsWith('http')) continue;
      const resolved = poster.startsWith('/') ? path.join(process.cwd(), poster) : path.resolve(dir, poster);
      assert.ok(fs.existsSync(resolved), `Broken poster src in ${p.path}: ${poster} -> ${resolved}`);
    }
  }
});

test('all internal links in dedicated pages resolve to existing targets', () => {
  for (const p of pages) {
    if (!fs.existsSync(p.path)) continue;
    const html = fs.readFileSync(p.path, 'utf8');
    const dir = path.dirname(p.path);
    const hrefRegex = /href="([^"#]+)"/g;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1];
      if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) continue;
      const target = href.startsWith('/') ? path.join(process.cwd(), href) : path.resolve(dir, href);
      const exists = fs.existsSync(target) || fs.existsSync(path.join(target, 'index.html'));
      assert.ok(exists, `Broken internal href in ${p.path}: ${href} -> ${target}`);
    }
  }
});

