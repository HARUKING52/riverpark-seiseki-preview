# RIVER PARK 聖蹟桜ヶ丘 Full Site Expansion & Program Detail Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the RIVER PARK 聖蹟桜ヶ丘 website with 6 rich dedicated subpages linked from the global header, a 5-category top-page `PROGRAM` section including Kids School, a 3-column photo grid + rich video/environment/body-and-mind modal experience across all program pages, and real Instagram video/embed integration (`@riverpark.tokyo` and instructors).

**Architecture:** Static HTML5/CSS3 multi-page architecture sharing `include/header.html`, `include/footer.html`, `common/css/common.css`, and `common/css/subpage-gentle.css`. Real Instagram reels/posts are integrated via a hybrid approach: locally downloaded MP4/JPG assets (`img/insta/`) for zero-latency `<video autoplay loop muted playsinline>` inside program detail modals, paired with official Instagram `<iframe src="https://www.instagram.com/p/<shortcode>/embed/">` embeds across page sections.

**Tech Stack:** HTML5, CSS3 (CSS Grid `.rp-grid-3`, Flexbox, responsive media queries), jQuery + Modaal.js (existing modal plugin), Python (for one-time Instagram media extraction), Node.js built-in test runner (`node:test`, `node:assert/strict`).

**Spec:** `docs/superpowers/specs/2026-11-11-riverpark-full-site-expansion-design.md`

## Global Constraints

- Brand theme & copy: `「わたしと自然が心地よくつながる毎日を、ここから。」`
- Color palette: pure white `#ffffff`, soft off-white `#fafafa`, River Sky Blue `#72bcd9`, dark charcoal text `#222222` / `#555555`.
- Typography: `'Yu Mincho', 'YuMincho', 'Hiragino Mincho ProN', serif` for headings; clean sans-serif for body copy; zero emojis in UI headings or cards.
- Grid sizing rule: Program lists and facility lists MUST use the clean borderless 3-column photo grid (`.rp-grid-3`, `grid-template-columns: repeat(3, 1fr)`, `gap: 36px 28px`, `aspect-ratio: 3 / 2` images) on desktop (`<=960px` 2 columns, `<=600px` 1 column).
- Official pricing & reservation URLs: Free Pass `月額 13,612円（税込）`, Drop-in `3,850円 / 回（税込）`, Bouldering `1,980円 / 回（税込）`, Kids School `月額 7,480円（税込）〜`; reservation links must point to the existing Sports Club NAS URL (`https://rsvprime.nas-club.co.jp/members/NR020...`).
- Subpage volume: Every dedicated subpage (`/concept/`, `/lounge/`, `/program/`, `/instructor/`, `/plan/`, `/access/`) must contain 5–6 substantive `<section>` blocks.

## Review Focus

- Root-relative vs relative asset paths in newly created subpage directories (`/concept/`, `/program/`, `/instructor/`, `/plan/`, `/access/`): all image/video/CSS/JS references must resolve to existing files on disk with zero 404s.
- Modaal popup target IDs (`#program1_1` .. `#program1_15`, `#program2_1` .. `#program2_3`, `#program3_1` .. `#program3_4` in `studio/index.html`, and `#program1_1` .. `#program1_7` in `outdoorfitness-program/index.html`): every `.rp-grid-3` card trigger link (`href="#program..." class="modal"`) must match its corresponding modal container `id` and contain all 4 required blocks (`ENVIRONMENT`, `WHAT WE DO`, `PHYSICAL EFFECT`, `MENTAL EFFECT`).
- HTML5 `<video>` inside hidden modals: videos inside `.modal_box` must include `autoplay loop muted playsinline` and a valid `poster` attribute pointing to an existing local image so browsers render immediately even before playback starts.
- Keyboard accessibility & mobile responsiveness on `.rp-grid-3`, `.rp-modal-detail`, and `.table-wrapper`: tables must retain `tabindex="0" role="region"`, and 2-column modal grids must stack cleanly to 1 column under `768px`.
- Instructor category filter tabs on `/instructor/index.html`: clicking a filter button (`data-filter="studio"`, etc.) must filter cards without breaking layout or leaving empty gaps, and work gracefully if JS is slow.

---

### Task 1: Instagram Media Extraction, Global Header/Footer Routing & Shared 3-Column/Modal CSS

**Files:**
- Create: `img/insta/riverpark_3rd_anniv.mp4`, `img/insta/kids_dance_river.mp4`, `img/insta/ayumi_riverside_yoga.mp4`, `img/insta/ai_aroma_yoga.mp4`, `img/insta/upcycle_event.mp4`, `img/insta/bouldering_school_1.jpg`, `img/insta/kids_bouldering_interview.jpg`, `img/insta/maiko_pilates_1.jpg`, `img/insta/kota_holistic_yoga_1.jpg`
- Modify: `include/header.html`, `include/footer.html`, `common/css/subpage-gentle.css`
- Test: `tests/header-footer.test.mjs`

**Interfaces:**
- Consumes: Public Instagram embed endpoints (`https://www.instagram.com/p/<shortcode>/embed/`) for verified shortcodes `Dd84ReqzZLA`, `DcLDyN4E4jk`, `DfMc6Rrz-Vk`, `DeohuICxHws`, `DeEKA1pzaZ1`, `DelfVg1E-tr`, `DfbtP2cqvpS`, `Dd08Gi7j87v`, `DPYKWpGj43S`.
- Produces:
  - Local media files in `img/insta/` used by Tasks 2, 3, and 4.
  - Updated `include/header.html` and `include/footer.html` linking to `/concept/`, `/program/`, `/instructor/`, `/lounge/`, `/plan/`, `/program/#schedule`, `/access/`, and `/first-time/`.
  - Shared CSS classes in `common/css/subpage-gentle.css`: `.rp-grid-3`, `.rp-card-3`, `.rp-modal-detail`, `.rp-modal-top`, `.rp-modal-effects`, `.rp-insta-embed-grid`, `.rp-story-grid`, `.rp-filter-tabs`.

- [ ] **Step 1: Update `tests/header-footer.test.mjs` to assert dedicated page links and local Instagram media files**

```javascript
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
```

- [ ] **Step 2: Run `node --test tests/header-footer.test.mjs` to verify it fails**

Run: `node --test tests/header-footer.test.mjs`
Expected: FAIL (`Expected header.html to link to /concept/` and `Missing img/insta/riverpark_3rd_anniv.mp4`)

- [ ] **Step 3: Extract Instagram MP4/JPG assets into `img/insta/` and update `include/header.html`, `include/footer.html`, and `common/css/subpage-gentle.css`**

Download the verified `video_url` and `display_url` streams from the Instagram `/p/<shortcode>/embed/` `contextJSON` into `img/insta/`, update `include/header.html` and `include/footer.html` so all navigation items point to `/concept/`, `/program/`, `/instructor/`, `/lounge/`, `/plan/`, `/program/#schedule`, `/access/`, and add `.rp-grid-3`, `.rp-modal-detail`, `.rp-insta-embed-grid`, `.rp-story-grid`, and `.rp-filter-tabs` to `common/css/subpage-gentle.css`.

- [ ] **Step 4: Run `node --test tests/header-footer.test.mjs` to verify it passes**

Run: `node --test tests/header-footer.test.mjs`
Expected: PASS (3/3 tests pass)

- [ ] **Step 5: Commit Task 1**

```bash
git add img/insta include/header.html include/footer.html common/css/subpage-gentle.css tests/header-footer.test.mjs
git commit -m "feat(common): add extracted Instagram media, dedicated header nav links, and 3-column/modal CSS"
```

---

### Task 2: Top Page Expansion (`index.html` & `css/top.css`) — Kids School in PROGRAM, Official Instagram Embeds & Dedicated Page Routing

**Files:**
- Modify: `index.html`, `css/top.css`
- Test: `tests/top-page.test.mjs`

**Interfaces:**
- Consumes: `img/insta/*`, `kids/kids-school/img/main.jpg`, dedicated page URLs (`/concept/`, `/lounge/`, `/program/`, `/instructor/`, `/plan/`, `/access/`, `/kids/`).
- Produces: Updated `index.html` and `css/top.css` with 5 circular program cards (including `キッズスクール`), 3 official Instagram `<iframe src="https://www.instagram.com/p/<shortcode>/embed/">` embeds (`Dd84ReqzZLA`, `DfMc6Rrz-Vk`, `DfbtP2cqvpS`), and dedicated subpage links.

- [ ] **Step 1: Update `tests/top-page.test.mjs` to test Kids School in PROGRAM, Instagram embeds, and dedicated page buttons**

```javascript
// Add assertions inside tests/top-page.test.mjs:
assert.ok(html.includes('キッズスクール'), 'PROGRAM section must include キッズスクール');
assert.ok(html.includes('href="kids/"'), 'PROGRAM section must link to kids/');
assert.ok(html.includes('https://www.instagram.com/p/Dd84ReqzZLA/embed/'), 'INSTAGRAM section must embed 3rd anniversary reel Dd84ReqzZLA');
assert.ok(html.includes('https://www.instagram.com/p/DfMc6Rrz-Vk/embed/'), 'INSTAGRAM section must embed riverside yoga reel DfMc6Rrz-Vk');
assert.ok(html.includes('https://www.instagram.com/p/DfbtP2cqvpS/embed/'), 'INSTAGRAM section must embed kids bouldering reel DfbtP2cqvpS');
for (const link of ['href="concept/"', 'href="lounge/"', 'href="program/"', 'href="instructor/"', 'href="plan/"', 'href="access/"']) {
  assert.ok(html.includes(link), `index.html should link to dedicated subpage ${link}`);
}
```

- [ ] **Step 2: Run `node --test tests/top-page.test.mjs` to verify it fails**

Run: `node --test tests/top-page.test.mjs`
Expected: FAIL (`PROGRAM section must include キッズスクール`)

- [ ] **Step 3: Update `index.html` and `css/top.css`**

Add the 5th circular card (`キッズスクール` linking to `kids/`, image `kids/kids-school/img/main.jpg`, copy `ボルダリングやダンスを通じて、お子様の挑戦する心と身体を育む`) in `#program`, add the 5-circle responsive flex/grid layout in `css/top.css`, add the 3-column official Instagram embed block in `#instagram`, and link each section's detail CTA to `concept/`, `lounge/`, `program/`, `instructor/`, `plan/`, and `access/`.

- [ ] **Step 4: Run `node --test tests/top-page.test.mjs` to verify it passes**

Run: `node --test tests/top-page.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit Task 2**

```bash
git add index.html css/top.css tests/top-page.test.mjs
git commit -m "feat(top): add Kids School to PROGRAM, official Instagram embeds, and dedicated subpage links"
```

---

### Task 3: Dedicated Brand, Facility, Plan & Access Subpages (`concept/`, `lounge/`, `plan/`, `access/`)

**Files:**
- Create: `concept/index.html`, `plan/index.html`, `access/index.html`, `tests/dedicated-pages.test.mjs`
- Modify: `lounge/index.html`
- Test: `tests/dedicated-pages.test.mjs`

**Interfaces:**
- Consumes: `common/css/subpage-gentle.css` (`.rp-grid-3`, `.rp-story-grid`, `.rp-insta-embed-grid`), `img/insta/*`, `img/top/*`.
- Produces:
  - `concept/index.html` (6 sections including 4 time-of-day stories and `Dd84ReqzZLA` video/embed)
  - `lounge/index.html` (6 sections including the exact 6-item `FACILITY & FLOOR` `.rp-grid-3` from the user's reference image and `img_1f.jpg` / `img_2f.jpg` floor maps)
  - `plan/index.html` (6 sections with official `13,612円` / `3,850円` / `1,980円` / `7,480円` pricing, 3 lifestyle model cases, rental table, and FAQ)
  - `access/index.html` (5 sections with 3-step photo walk guide in `.rp-grid-3`, facility table, Google Map, and bicycle/car/stroller guide)

- [ ] **Step 1: Write `tests/dedicated-pages.test.mjs` to verify structure, volume (>= 5 sections each), and required content**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('concept, lounge, plan, and access dedicated pages exist and each contain at least 5 substantive sections and .rp-grid-3', () => {
  const pages = [
    { path: 'concept/index.html', minSections: 6, mustInclude: ['わたしと自然が心地よくつながる毎日を、ここから。', '08:00', '19:30', 'Dd84ReqzZLA', 'rp-grid-3'] },
    { path: 'lounge/index.html', minSections: 6, mustInclude: ['2F ヨガスタジオ（約100㎡）', '2F 会員制ワークラウンジ', '1F ボルダリングジム', 'ロッカー＆シャワールーム', '1F SUP艇庫（多摩川直結）', 'クラブハウス・レンタル対応', 'img_1f.jpg', 'rp-grid-3'] },
    { path: 'plan/index.html', minSections: 6, mustInclude: ['13,612円', '3,850円', '1,980円', '7,480円', 'tabindex="0"', 'rp-grid-3'] },
    { path: 'access/index.html', minSections: 5, mustInclude: ['聖蹟桜ヶ丘駅', '徒歩5分', '一ノ宮1-26-1', '平日 9:00-22:00', 'rp-grid-3'] },
  ];

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
```

- [ ] **Step 2: Run `node --test tests/dedicated-pages.test.mjs` to verify it fails**

Run: `node --test tests/dedicated-pages.test.mjs`
Expected: FAIL (`Expected concept/index.html to exist`)

- [ ] **Step 3: Implement `concept/index.html`, `lounge/index.html`, `plan/index.html`, and `access/index.html`**

Build all 4 pages following Section 5.1, 5.2, 5.5, and 5.6 of the design spec, using `common/css/subpage-gentle.css` and `.rp-grid-3`.

- [ ] **Step 4: Run `node --test tests/dedicated-pages.test.mjs` to verify it passes**

Run: `node --test tests/dedicated-pages.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit Task 3**

```bash
git add concept/index.html lounge/index.html plan/index.html access/index.html tests/dedicated-pages.test.mjs
git commit -m "feat(subpages): build rich concept, lounge/space, plan, and access dedicated pages"
```

---

### Task 4: Program Hub (`program/`), Instructor Directory (`instructor/`), and 3-Column + Rich Modal Program Pages (`studio/`, `outdoorfitness-program/`, `bouldering/`, `kids/`)

**Files:**
- Create: `program/index.html`, `instructor/index.html`
- Modify: `studio/index.html`, `outdoorfitness-program/index.html`, `bouldering/index.html`, `kids/index.html`, `tests/subpages.test.mjs`, `tests/site-integrity.test.mjs`
- Test: `tests/subpages.test.mjs`, `tests/site-integrity.test.mjs`

**Interfaces:**
- Consumes: `common/css/subpage-gentle.css` (`.rp-grid-3`, `.rp-modal-detail`, `.rp-insta-embed-grid`, `.rp-filter-tabs`), `img/insta/*`, `studio/img/inst_*.jpg`, `outdoorfitness-program/img/inst_*.jpg`, `bouldering/img/inst_*.jpg`, `kids/img/inst_*.jpg`.
- Produces:
  - `program/index.html` (6 sections including `#schedule` and 3-column mood diagnosis & Instagram reel embeds)
  - `instructor/index.html` (5 sections with category filter tabs, all 31 instructors, and 6 instructor Instagram embeds)
  - Upgraded `studio/index.html` (all 22 classes rendered as `.rp-grid-3` photo cards + all 22 `#program*` modals upgraded to `.rp-modal-detail` with video/image + `ENVIRONMENT` + `WHAT WE DO` + `PHYSICAL EFFECT` + `MENTAL EFFECT` + official Instagram embeds)
  - Upgraded `outdoorfitness-program/index.html` (all 7 outdoor programs + SUP rendered as `.rp-grid-3` photo cards + all `#program1_*` modals upgraded to `.rp-modal-detail` + official Instagram embeds)
  - Upgraded `bouldering/index.html` and `kids/index.html` (`.rp-grid-3` environment/effect cards + official Instagram embeds `DelfVg1E-tr`, `DfbtP2cqvpS`, `DcLDyN4E4jk`)

- [ ] **Step 1: Update `tests/subpages.test.mjs` and `tests/site-integrity.test.mjs` to test all new pages, 3-column grids, and rich modals**

```javascript
// In tests/subpages.test.mjs:
// 1. Assert program/index.html (with id="schedule") and instructor/index.html (with >= 30 instructor cards and 6 Instagram embeds) exist.
// 2. Assert studio/index.html renders all 22 classes inside .rp-grid-3 with photo thumbnails and upgrades all 22 #program* modals to include ENVIRONMENT, WHAT WE DO, PHYSICAL EFFECT, MENTAL EFFECT, and media (<video or <img).
// 3. Assert outdoorfitness-program/index.html renders all 7 programs inside .rp-grid-3 with photo thumbnails and upgrades all 7 #program1_* modals to include ENVIRONMENT, WHAT WE DO, PHYSICAL EFFECT, MENTAL EFFECT, and media.
// 4. Assert bouldering/index.html and kids/index.html include .rp-grid-3 and official Instagram embeds (DelfVg1E-tr, DfbtP2cqvpS, DcLDyN4E4jk).
// In tests/site-integrity.test.mjs:
// Add concept/index.html, program/index.html, instructor/index.html, plan/index.html, access/index.html to the pages list and verify zero broken local href/src/poster paths.
```

- [ ] **Step 2: Run `node --test tests/subpages.test.mjs tests/site-integrity.test.mjs` to verify it fails**

Run: `node --test tests/subpages.test.mjs tests/site-integrity.test.mjs`
Expected: FAIL (`program/index.html` missing and `studio/index.html` modals missing `ENVIRONMENT` / `PHYSICAL EFFECT` / `MENTAL EFFECT`)

- [ ] **Step 3: Implement `program/index.html`, `instructor/index.html`, and upgrade `studio/index.html`, `outdoorfitness-program/index.html`, `bouldering/index.html`, and `kids/index.html`**

Implement the 6-section `/program/index.html` hub, the 5-section `/instructor/index.html` directory (all 31 instructors + filter tabs + 6 official embeds), and transform `/studio/index.html`, `/outdoorfitness-program/index.html`, `/bouldering/index.html`, and `/kids/index.html` to use `.rp-grid-3` 3-column photo cards, `.rp-modal-detail` rich modals (with local MP4 videos / photos, `ENVIRONMENT`, `WHAT WE DO`, `PHYSICAL EFFECT`, `MENTAL EFFECT`), and official Instagram embeds.

- [ ] **Step 4: Run the full test suite to verify all tests pass**

Run: `node --test tests/header-footer.test.mjs tests/top-page.test.mjs tests/dedicated-pages.test.mjs tests/subpages.test.mjs tests/site-integrity.test.mjs`
Expected: PASS (100% pass, zero failures)

- [ ] **Step 5: Commit Task 4**

```bash
git add program/index.html instructor/index.html studio/index.html outdoorfitness-program/index.html bouldering/index.html kids/index.html tests/subpages.test.mjs tests/site-integrity.test.mjs
git commit -m "feat(programs): add program & instructor pages and upgrade all classes to 3-column grid + rich video/effect modals"
```
