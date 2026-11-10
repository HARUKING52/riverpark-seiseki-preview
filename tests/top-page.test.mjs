import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/Users/fc3sl/.gemini/antigravity/scratch/riverpark-seiseki';

test('index.html implements all gentle redesign sections and fixes legacy bugs', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const required of [
    '「わたしと自然が心地よくつながる毎日を、ここから。」',
    'SPACE &amp; COMFORT',
    '自然光と多摩川の風に包まれる空間',
    'PROGRAM',
    '深い呼吸で、心とからだをほどく',
    'パズルのように夢中で身体を動かす',
    '水の上で、自然とひとつになる',
    '川を眺めながら、静かに自分と向き合う',
    'INSTRUCTOR',
    '経験豊かなインストラクターが、一人ひとりのペースに合わせて丁寧にお迎えします。',
    'studio/instructor/ayumi.html',
    'studio/instructor/chisato.html',
    'studio/instructor/yuhei.html',
    'bouldering/instructor/asari.html',
    'フリーパス会員',
    'application/ld+json'
  ]) {
    assert.ok(html.includes(required), `Missing required content in index.html: ${required}`);
  }
  assert.ok(!/[^フ]リーパス会員/.test(html), 'Typo リーパス会員 must be fixed to フリーパス会員');
  assert.ok(!html.includes('href=""'), 'index.html must not contain empty href=""');
  assert.ok(!html.includes('favicon.png/"'), 'favicon.png must not have trailing slash');
});

test('all local image src paths in index.html exist on disk and have non-empty alt attributes', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const imgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const src = match[1];
    if (!src.startsWith('http')) {
      const cleanSrc = src.replace(/^\//, '');
      assert.ok(fs.existsSync(path.join(root, cleanSrc)), `Missing image file: ${cleanSrc}`);
    }
    const altMatch = fullTag.match(/alt="([^"]*)"/);
    assert.ok(altMatch && altMatch[1].trim().length > 0, `Empty alt attribute on image: ${fullTag}`);
  }
});
