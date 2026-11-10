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
