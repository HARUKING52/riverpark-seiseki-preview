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

test('Task 2: Top page includes Kids School in PROGRAM, official Instagram embeds, and dedicated subpage routing', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'css/top.css'), 'utf8');

  // Kids School in PROGRAM
  assert.ok(html.includes('kids/kids-school/img/main.jpg'), 'PROGRAM section must reference kids/kids-school/img/main.jpg');
  assert.ok(html.includes('alt="キッズスクール（ボルダリング・ダンス）"'), 'Kids School image must have descriptive alt');
  assert.ok(html.includes('ボルダリングやダンスを通じて、お子様の挑戦する心と身体を育む'), 'Kids School must have poetic copy');
  assert.ok(html.includes('キッズスクール'), 'PROGRAM section must include キッズスクール');
  assert.ok(html.includes('href="kids/"'), 'PROGRAM section must link to kids/');
  assert.ok(html.includes('すべてのプログラムを見る'), 'PROGRAM section must include CTA to all programs');

  // Instagram embeds
  assert.ok(html.includes('https://www.instagram.com/p/Dd84ReqzZLA/embed/'), 'INSTAGRAM section must embed 3rd anniversary reel Dd84ReqzZLA');
  assert.ok(html.includes('https://www.instagram.com/p/DfMc6Rrz-Vk/embed/'), 'INSTAGRAM section must embed riverside yoga reel DfMc6Rrz-Vk');
  assert.ok(html.includes('https://www.instagram.com/p/DfbtP2cqvpS/embed/'), 'INSTAGRAM section must embed kids bouldering reel DfbtP2cqvpS');

  // Dedicated subpage routing links
  for (const link of ['href="concept/"', 'href="lounge/"', 'href="program/"', 'href="instructor/"', 'href="plan/"', 'href="access/"']) {
    assert.ok(html.includes(link), `index.html should link to dedicated subpage ${link}`);
  }

  // CSS classes
  assert.ok(css.includes('five_col_circles') || css.includes('.service_list.five_col_circles'), 'top.css must style 5-circle grid');
  assert.ok(css.includes('.insta_embed_row') || css.includes('.rp-insta-embed-grid'), 'top.css must style Instagram embed row/grid');
});

test('Regression lock: #space-comfort does not collide with legacy .rental fixed height and broken font links are removed', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(!html.includes('id="space-comfort" class="rental'), '#space-comfort must not include legacy .rental class that clamps height to 335px');
  assert.ok(html.includes('id="space-comfort" class="space_comfort"'), '#space-comfort must use class="space_comfort"');
  assert.ok(!html.includes('href="https://googleapis.com"'), 'index.html must not contain broken href="https://googleapis.com"');
  assert.ok(!html.includes('href="https://gstatic.com"'), 'index.html must not contain broken href="https://gstatic.com"');

  const css = fs.readFileSync(path.join(root, 'css/top.css'), 'utf8');
  assert.ok(!css.includes('width: calc(320 / 750 * 100vw)'), 'facility_image div must not use legacy calc(320 / 750 * 100vw) that wraps into a single left-aligned column on mobile');
  assert.ok(css.includes('grid-template-columns: repeat(2, 1fr)'), 'facility_image_area on mobile must use a 2-column grid');
  assert.ok(css.includes('.space_comfort .sub_link a::after'), 'sub_link must use B案 outline pill button with ::after arrow');

  const subCss = fs.readFileSync(path.join(root, 'common/css/subpage-gentle.css'), 'utf8');
  assert.ok(subCss.includes('.effect_insta_note a::after'), 'subpage effect_insta_note link must use B案 outline pill button with ::after arrow');
});


