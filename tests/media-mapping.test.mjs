import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const PAGES = [
  'index.html',
  'concept/index.html',
  'lounge/index.html',
  'program/index.html',
  'studio/index.html',
  'outdoorfitness-program/index.html',
  'bouldering/index.html',
  'kids/index.html',
  'kids/kids-school/index.html',
  'kids/kids-school/kidsbouldering.html',
  'kids/kids-school/kidsfreestyledance.html',
  'rentalservice/index.html',
  'instructor/index.html',
  'plan/index.html',
  'access/index.html',
  'first-time/index.html',
];

function readPage(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

test('Every img src and video poster across all 14 pages resolves to a non-empty local file', () => {
  for (const page of PAGES) {
    const html = readPage(page);
    const pageDir = path.dirname(path.join(ROOT, page));
    const attrRegex = /(?:<img[^>]+src|<video[^>]+poster)=["']([^"']+)["']/gi;
    let m;
    while ((m = attrRegex.exec(html)) !== null) {
      const val = m[1];
      if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:')) continue;
      const cleanVal = val.split('?')[0].split('#')[0];
      const resolved = cleanVal.startsWith('/')
        ? path.join(ROOT, cleanVal.slice(1))
        : path.resolve(pageDir, cleanVal);
      assert.ok(
        fs.existsSync(resolved) && fs.statSync(resolved).size > 0,
        `Missing or empty media file referenced in ${page}: ${val} -> ${resolved}`
      );
    }
  }
});

test('outdoorfitness-program/index.html uses real SUP and outdoor photos and never uses 2F lounge or 1F exterior on cards', () => {
  const html = readPage('outdoorfitness-program/index.html');
  assert.ok(!html.includes('facility_img2_4.jpg'), 'Outdoor page must not use 2F work lounge photo facility_img2_4.jpg');
  assert.ok(!html.includes('facility_img1_1.jpg'), 'Outdoor page must not use 1F building exterior for Hybrid Workout');
  for (const required of [
    'rp_sup_beginner_shore.jpg',
    'rp_sup_keio_bridge.jpg',
    'rp_sup_stepup_stream.jpg',
    'rp_riverside_yoga_2.jpg',
    'insta_nico_run_outdoor.jpg',
    'insta_nico_run_shoes.jpg',
  ]) {
    assert.ok(html.includes(required), `Outdoor page missing ${required}`);
  }
});

test('studio/index.html uses diverse real studio/yoga/pilates photos and never uses 1F building exterior', () => {
  const html = readPage('studio/index.html');
  assert.ok(!html.includes('facility_img1_1.jpg'), 'Studio page must not use 1F building exterior');
  for (const required of [
    'mv2_flow_yoga.jpg',
    'rp_2f_studio_warrior.jpg',
    'insta_sako_pilates_mat.jpg',
    'insta_manami_pilates_ring.jpg',
    'insta_manami_pilates_bridge.jpg',
    'insta_kei_crescent_lunge.jpg',
    'insta_nana_yoga_tree.jpg',
    'insta_nana_yoga_breath.jpg',
    'insta_kiwako_floor_core.jpg',
    'insta_kiwako_supine_twist.jpg',
    'insta_naoko_aroma_incense.jpg',
    'insta_yoshiko_bolster_nidra.jpg',
    'insta_ojas_night_yoga.jpg',
  ]) {
    assert.ok(html.includes(required), `Studio page missing ${required}`);
  }
});

test('lounge/index.html uses dedicated 2F lounge booth, phonebooth, window, counter, and floor plan assets', () => {
  const html = readPage('lounge/index.html');
  for (const required of [
    'rp_2f_lounge_window.jpg',
    'rp_2f_lounge_booths.jpg',
    'rp_2f_lounge_phonebooth.jpg',
    'rp_2f_lounge_counter.jpg',
    'rp_2f_lounge_atrium.jpg',
    'bluetama_floor_1f.jpg',
    'bluetama_floor_2f.jpg',
  ]) {
    assert.ok(html.includes(required), `Lounge page missing ${required}`);
  }
});

test('access/index.html uses real station-to-facility route photos and area map instead of indoor studio/lounge photos', () => {
  const html = readPage('access/index.html');
  assert.ok(!html.includes('facility_img2_1.jpg'), 'Access page must not use 2F yoga studio photo for route step');
  assert.ok(!html.includes('facility_img2_3.jpg'), 'Access page must not use 2F lounge photo for route step');
  for (const required of [
    'prtimes_area_map.jpg',
    'rp_access_bridge.jpg',
    'rp_access_sakuterrace.jpg',
    'rp_1f_entrance_open.jpg',
  ]) {
    assert.ok(html.includes(required), `Access page missing ${required}`);
  }
});

test('concept/index.html and first-time/index.html use verified sunset bonfire, reception shop, and flow yoga photos', () => {
  const conceptHtml = readPage('concept/index.html');
  assert.ok(conceptHtml.includes('mv5_sunset_bonfire.jpg'), 'Concept page missing mv5_sunset_bonfire.jpg');
  assert.ok(conceptHtml.includes('insta_ayumi_riverside_class.jpg'), 'Concept page missing insta_ayumi_riverside_class.jpg');
  assert.ok(conceptHtml.includes('insta_naoko_aroma_incense.jpg'), 'Concept page missing insta_naoko_aroma_incense.jpg');

  const firstTimeHtml = readPage('first-time/index.html');
  assert.ok(firstTimeHtml.includes('rp_1f_reception_shop.jpg'), 'First-time page missing rp_1f_reception_shop.jpg');
  assert.ok(firstTimeHtml.includes('mv2_flow_yoga.jpg'), 'First-time page missing mv2_flow_yoga.jpg');

  const programHtml = readPage('program/index.html');
  const instructorHtml = readPage('instructor/index.html');
  assert.ok(programHtml.includes('rp_riverside_yoga_1.jpg'), 'Program page hero should use rp_riverside_yoga_1.jpg');
  assert.ok(!programHtml.includes('mv2_flow_yoga.jpg'), 'Program page should not duplicate instructor hero mv2_flow_yoga.jpg');
  assert.ok(instructorHtml.includes('mv2_flow_yoga.jpg'), 'Instructor page hero should use mv2_flow_yoga.jpg');
});
