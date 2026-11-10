import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/Users/fc3sl/.gemini/antigravity/scratch/riverpark-seiseki';

test('header.html uses root-relative gentle navigation links matching the approved design', () => {
  const html = fs.readFileSync(path.join(root, 'include/header.html'), 'utf8');
  for (const expected of ['コンセプト', 'プログラム', 'インストラクター', 'ワークラウンジ', 'プラン', 'スケジュール', 'アクセス', '体験のご予約はこちら']) {
    assert.ok(html.includes(expected), `Missing nav item: ${expected}`);
  }
  assert.ok(html.includes('href="/lounge/"'), 'Missing /lounge/ link');
});

test('footer.html links to valid root-relative /pdf/member_agreement.pdf without empty href', () => {
  const html = fs.readFileSync(path.join(root, 'include/footer.html'), 'utf8');
  assert.ok(html.includes('href="/pdf/member_agreement.pdf"'), 'Should point to /pdf/member_agreement.pdf');
  assert.ok(!html.includes('href=""'), 'Footer must not contain empty href=""');
});
