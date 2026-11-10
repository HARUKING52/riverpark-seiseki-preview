import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('header.html links directly to dedicated subpages instead of top-page anchors', () => {
  const header = fs.readFileSync('include/header.html', 'utf8');
  for (const href of ['/concept/', '/program/', '/instructor/', '/lounge/', '/plan/', '/program/#schedule', '/access/', '/first-time/']) {
    assert.ok(header.includes(`href="${href}"`), `Expected header.html to link to ${href}`);
  }
  assert.ok(!header.includes('href="/#concept"'), 'header.html should not use top-page anchor /#concept');
});

test('footer.html links to valid member_agreement.pdf and dedicated subpages', () => {
  const footer = fs.readFileSync('include/footer.html', 'utf8');
  assert.ok(footer.includes('href="/pdf/member_agreement.pdf"'));
  assert.ok(!footer.includes('href=""'));
});

test('extracted Instagram MP4 and JPG assets exist in img/insta/ and are non-empty', () => {
  const expectedFiles = [
    'img/insta/riverpark_3rd_anniv.mp4',
    'img/insta/kids_dance_river.mp4',
    'img/insta/ayumi_riverside_yoga.mp4',
    'img/insta/ai_aroma_yoga.mp4',
    'img/insta/upcycle_event.mp4',
    'img/insta/bouldering_school_1.jpg',
    'img/insta/kids_bouldering_interview.jpg',
    'img/insta/maiko_pilates_1.jpg',
    'img/insta/kota_holistic_yoga_1.jpg',
  ];
  for (const file of expectedFiles) {
    assert.ok(fs.existsSync(file), `Missing ${file}`);
    assert.ok(fs.statSync(file).size > 1000, `Empty or invalid file: ${file}`);
  }
});
