import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/Users/fc3sl/.gemini/antigravity/scratch/riverpark-seiseki';

test('first-time and lounge subpages exist and follow gentle design', () => {
  const firstTime = fs.readFileSync(path.join(root, 'first-time/index.html'), 'utf8');
  assert.ok(firstTime.includes('FIRST TIME'), 'first-time page must have FIRST TIME heading');
  assert.ok(firstTime.includes('レンタル'), 'first-time page must explain rental items');

  const lounge = fs.readFileSync(path.join(root, 'lounge/index.html'), 'utf8');
  assert.ok(lounge.includes('WORK LOUNGE'), 'lounge page must have WORK LOUNGE heading');
  assert.ok(lounge.includes('多摩川'), 'lounge page must describe the Tama River view');
});

test('studio and outdoorfitness subpages explain program effects for beginners and fix Nordic Walking modal bug', () => {
  const studio = fs.readFileSync(path.join(root, 'studio/index.html'), 'utf8');
  assert.ok(studio.includes('自律神経'), 'studio page should explain Yoga benefits in plain language');
  assert.ok(studio.includes('インナーマッスル'), 'studio page should explain Pilates benefits in plain language');

  const outdoor = fs.readFileSync(path.join(root, 'outdoorfitness-program/index.html'), 'utf8');
  const modal1Match = outdoor.match(/<div id="program1_1"[\s\S]*?<\/div>\s*<\/div>/);
  assert.ok(modal1Match, 'program1_1 modal must exist');
  assert.ok(modal1Match[0].includes('2本の専用ポールを使って多摩川河川敷を歩くノルディックウォーキング'), 'program1_1 must describe Nordic Walking');
  assert.ok(!modal1Match[0].includes('ボルダリングは、道具を使わず'), 'program1_1 must not contain copy-pasted Bouldering text');
});

test('program hub page (program/index.html) exists and has 6 substantive sections, schedule, mood cards, and instagram embeds', () => {
  const progPath = path.join(root, 'program/index.html');
  assert.ok(fs.existsSync(progPath), 'program/index.html must exist');
  const html = fs.readFileSync(progPath, 'utf8');

  const sections = (html.match(/<section\b/g) || []).length;
  assert.ok(sections >= 6, `program/index.html must have at least 6 sections, found ${sections}`);
  assert.ok(html.includes('id="schedule"'), 'program page must have id="schedule"');

  // 5 program categories
  assert.ok(html.includes('studio') || html.includes('スタジオ'), 'must include studio category');
  assert.ok(html.includes('outdoor') || html.includes('アウトドア'), 'must include outdoor category');
  assert.ok(html.includes('bouldering') || html.includes('ボルダリング'), 'must include bouldering category');
  assert.ok(html.includes('lounge') || html.includes('ラウンジ'), 'must include lounge category');
  assert.ok(html.includes('kids') || html.includes('キッズ'), 'must include kids category');

  // 6 mood/purpose diagnosis cards in .rp-grid-3
  assert.ok(html.includes('rp-grid-3'), 'must contain .rp-grid-3');
  assert.ok(html.includes('肩こり') || html.includes('自律神経') || html.includes('体幹'), 'must have mood diagnosis content');

  // Instagram embeds
  assert.ok(html.includes('DfMc6Rrz-Vk'), 'must include Ayumi riverside reel DfMc6Rrz-Vk');
  assert.ok(html.includes('DeohuICxHws'), 'must include Ai aroma reel DeohuICxHws');
  assert.ok(html.includes('DcLDyN4E4jk'), 'must include kids dance reel DcLDyN4E4jk');

  // Schedule PDF links and reservation URL
  assert.ok(html.includes('schedule_10.pdf') || html.includes('schedule_11.pdf'), 'must link to monthly schedule PDF');
  assert.ok(html.includes('rsvprime.nas-club.co.jp'), 'must include NAS reservation URL');
});

test('instructor directory page (instructor/index.html) exists and has filter tabs, 31 instructors, and 6 instagram embeds', () => {
  const instPath = path.join(root, 'instructor/index.html');
  assert.ok(fs.existsSync(instPath), 'instructor/index.html must exist');
  const html = fs.readFileSync(instPath, 'utf8');

  const sections = (html.match(/<section\b/g) || []).length;
  assert.ok(sections >= 5, `instructor/index.html must have at least 5 sections, found ${sections}`);

  // Filter tabs
  assert.ok(html.includes('rp-filter-tabs'), 'must contain .rp-filter-tabs');
  assert.ok(html.includes('STUDIO'), 'must include STUDIO filter');
  assert.ok(html.includes('OUTDOOR'), 'must include OUTDOOR filter');
  assert.ok(html.includes('BOULDERING'), 'must include BOULDERING filter');
  assert.ok(html.includes('KIDS'), 'must include KIDS filter');

  // 31 instructor cards
  const instructorLinks = (html.match(/href="[^"]*instructor\/[^"]+\.html"/g) || []).length;
  assert.ok(instructorLinks >= 30, `Expected at least 30 instructor links, found ${instructorLinks}`);

  // 6 Instagram embeds
  const embeds = ['DfMc6Rrz-Vk', 'Dd08Gi7j87v', 'DPYKWpGj43S', 'DfRS_kRTgRJ', 'DewIw-RRlBJ', 'DfLggS8zieT'];
  for (const code of embeds) {
    assert.ok(html.includes(code), `instructor page must include Instagram embed ${code}`);
  }
});

test('studio/index.html renders 22 classes in .rp-grid-3 and upgrades all 22 modals to .rp-modal-detail', () => {
  const studioPath = path.join(root, 'studio/index.html');
  const html = fs.readFileSync(studioPath, 'utf8');

  assert.ok(html.includes('rp-grid-3'), 'studio page must include .rp-grid-3');
  assert.ok(html.includes('rp-modal-detail'), 'studio page must use .rp-modal-detail');

  // Check 22 modal IDs
  const yogaIds = Array.from({ length: 15 }, (_, i) => `program1_${i + 1}`);
  const pilatesIds = Array.from({ length: 3 }, (_, i) => `program2_${i + 1}`);
  const trxIds = Array.from({ length: 4 }, (_, i) => `program3_${i + 1}`);
  const allIds = [...yogaIds, ...pilatesIds, ...trxIds];

  assert.equal(allIds.length, 22);

  for (const id of allIds) {
    assert.ok(html.includes(`href="#${id}"`), `Expected card link to #${id}`);
    const start = html.indexOf(`id="${id}"`);
    assert.ok(start !== -1, `Modal #${id} must exist`);
    const nextStart = html.indexOf('id="program', start + 20);
    const modalContent = nextStart !== -1 ? html.slice(start, nextStart) : html.slice(start, start + 5000);

    assert.ok(modalContent.includes('ENVIRONMENT') || modalContent.includes('行う環境'), `Modal #${id} must describe ENVIRONMENT`);
    assert.ok(modalContent.includes('WHAT WE DO') || modalContent.includes('実際に行うこと'), `Modal #${id} must describe WHAT WE DO`);
    assert.ok(modalContent.includes('PHYSICAL EFFECT') || modalContent.includes('からだへの心地よい変化'), `Modal #${id} must describe PHYSICAL EFFECT`);
    assert.ok(modalContent.includes('MENTAL EFFECT') || modalContent.includes('こころへの心地よい変化'), `Modal #${id} must describe MENTAL EFFECT`);
  }

  // Official Instagram embeds
  assert.ok(html.includes('DeohuICxHws'), 'studio page must include DeohuICxHws embed');
  assert.ok(html.includes('Dd08Gi7j87v'), 'studio page must include Dd08Gi7j87v embed');
  assert.ok(html.includes('DPYKWpGj43S'), 'studio page must include DPYKWpGj43S embed');
});

test('outdoorfitness-program/index.html renders outdoor programs in .rp-grid-3 and upgrades all 7 modals', () => {
  const outdoorPath = path.join(root, 'outdoorfitness-program/index.html');
  const html = fs.readFileSync(outdoorPath, 'utf8');

  assert.ok(html.includes('rp-grid-3'), 'outdoor page must include .rp-grid-3');
  assert.ok(html.includes('rp-modal-detail'), 'outdoor page must use .rp-modal-detail');

  const outdoorIds = Array.from({ length: 7 }, (_, i) => `program1_${i + 1}`);
  for (const id of outdoorIds) {
    assert.ok(html.includes(`href="#${id}"`), `Expected card link to #${id}`);
    const start = html.indexOf(`id="${id}"`);
    assert.ok(start !== -1, `Modal #${id} must exist`);
    const nextStart = html.indexOf('id="program', start + 20);
    const modalContent = nextStart !== -1 ? html.slice(start, nextStart) : html.slice(start, start + 5000);

    assert.ok(modalContent.includes('ENVIRONMENT') || modalContent.includes('行う環境'), `Modal #${id} must describe ENVIRONMENT`);
    assert.ok(modalContent.includes('WHAT WE DO') || modalContent.includes('実際に行うこと'), `Modal #${id} must describe WHAT WE DO`);
    assert.ok(modalContent.includes('PHYSICAL EFFECT') || modalContent.includes('からだへの心地よい変化'), `Modal #${id} must describe PHYSICAL EFFECT`);
    assert.ok(modalContent.includes('MENTAL EFFECT') || modalContent.includes('こころへの心地よい変化'), `Modal #${id} must describe MENTAL EFFECT`);
  }

  // Official Instagram embeds
  assert.ok(html.includes('DfMc6Rrz-Vk'), 'outdoor page must include DfMc6Rrz-Vk embed');
  assert.ok(html.includes('DfLggS8zieT'), 'outdoor page must include DfLggS8zieT embed');
});

test('bouldering and kids subpages include .rp-grid-3 and official Instagram embeds', () => {
  const bouldering = fs.readFileSync(path.join(root, 'bouldering/index.html'), 'utf8');
  assert.ok(bouldering.includes('rp-grid-3'), 'bouldering page must include .rp-grid-3');
  assert.ok(bouldering.includes('DelfVg1E-tr'), 'bouldering page must include DelfVg1E-tr embed');
  assert.ok(bouldering.includes('DfbtP2cqvpS'), 'bouldering page must include DfbtP2cqvpS embed');

  const kids = fs.readFileSync(path.join(root, 'kids/index.html'), 'utf8');
  assert.ok(kids.includes('rp-grid-3'), 'kids page must include .rp-grid-3');
  assert.ok(kids.includes('DfbtP2cqvpS'), 'kids page must include DfbtP2cqvpS embed');
  assert.ok(kids.includes('DcLDyN4E4jk'), 'kids page must include DcLDyN4E4jk embed');
  assert.ok(kids.includes('kids_dance_river.mp4'), 'kids page must include kids_dance_river.mp4');
});
