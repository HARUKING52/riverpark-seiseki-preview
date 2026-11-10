# RIVER PARK 聖蹟桜ヶ丘 Gentle Redesign HTML Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved gentle, spacious, non-salesy redesign of the RIVER PARK 聖蹟桜ヶ丘 website (`index.html`, shared header/footer, and beginner-friendly program/lounge subpages) in HTML/CSS using existing site photography and AI-generated lifestyle assets.

**Architecture:** Preserve the existing static multi-page architecture (`jQuery` + `common.js` header/footer injection via `/include/header.html` and `/include/footer.html` + `Swiper.js`) in `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki`. Re-architect `index.html` and `css/top.css` to match `riverpark_top_gentle_fullpage.jpg` (generous `#ffffff`/`#fafafa` whitespace, unobstructed photographs, left-aligned `#72bcd9` headings, circular program/instructor portraits, and clean `JSON-LD` structured data), while adding beginner-friendly program effect explanations and subpages (`/first-time/index.html`, `/lounge/index.html`).

**Tech Stack:** HTML5, CSS3 (`common/css/common.css`, `css/top.css`, `common/css/subpage-gentle.css`), Swiper.js, jQuery 3.3.1, Node.js `node:test` (for automated DOM/link/SEO verification).

**Spec:** `C:\Users\fc3sl\.gemini\antigravity\brain\16c422f1-3973-4022-8128-ab6455b05802\riverpark_redesign_plan.md` & `C:\Users\fc3sl\.gemini\antigravity\brain\16c422f1-3973-4022-8128-ab6455b05802\riverpark_top_gentle_fullpage.jpg`

## Global Constraints

- **Color Palette:** Pure white (`#ffffff`), soft off-white (`#fafafa`), pale water blue (`#dfeef4`), warm gray (`#edebeb`), and River Sky Blue (`#72bcd9`). Never use loud promotional colors (orange, red, neon, dark black bars).
- **Layout & Whitespace:** Content width `930px`–`980px` centered inside wide pure white margins (`padding: 70px 0`–`80px 0` per section). Never overlay text, badges, or buttons directly on top of photographs.
- **Heading Grammar:** Left-aligned `#72bcd9` English heading (`font-size: 20px; font-weight: 700`) with a smaller thin Japanese subtitle underneath (`color: #000000; font-size: 22px; font-weight: normal`).
- **Zero Pushy Sales Copy ("営業感ゼロ"):** No comic speech bubbles (`“ ”`), no `Step 1 → Step 2 → Step 3` sales funnel bars, no `(一番人気)` or `(お得！)` hype labels on the Top Page.
- **Asset Integrity:** Every `<img src="...">` and `<a href="...">` across modified pages must resolve to an existing file in `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki` or a valid external URL, with non-empty descriptive `alt` attributes.

## Review Focus

- **Relative Path Resolution in `/include/header.html` and `/include/footer.html`:** Because `common.js` injects `/include/header.html` and `/include/footer.html` into both root (`/index.html`) and nested pages (`/studio/index.html`, `/first-time/index.html`), all links and image paths inside `include/header.html` and `include/footer.html` must use root-relative paths starting with `/` (e.g., `/first-time/`, `/pdf/member_agreement.pdf`).
- **Empty Link & Typo Regression in `index.html` Plan Table:** The live site has a typo (`リーパス会員` instead of `フリーパス会員`) and 6 empty `<a href="">` tags in the `PLAN` table; tests must assert zero empty `href=""` attributes and exact `フリーパス会員` text.
- **Copy-Paste Modal Bug in `outdoorfitness-program/index.html`:** Modal `#program1_7` (`ノルディックウォーキングサークル`) currently contains Bouldering description text; tests must assert it describes Nordic Walking along the Tama River.
- **Invalid Favicon Trailing Slash:** Existing HTML files have `href="/common/img/favicon.png/"` (with a trailing slash causing 404); modified HTML files must use `href="/common/img/favicon.png"`.
- **Responsive Mobile Layout (`max-width: 768px`):** The 4-column circular grids (`.program_circle_list`, `.instructor_circle_list`) and `.space_comfort` overlapping box must wrap cleanly into 2-column or 1-column layouts on mobile without horizontal overflow.

---

### Task 1: Shared Header, Footer & Git Baseline Setup

**Files:**
- Create: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\header-footer.test.mjs`
- Modify: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\include\header.html:1-43`
- Modify: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\include\footer.html:1-4`
- Modify: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\common\css\common.css:1-135`

**Interfaces:**
- Consumes: Existing `/common/img/riverpark_logo.png` and `/pdf/member_agreement.pdf`.
- Produces: Root-relative navigation links in `/include/header.html` (`/#concept`, `/#program`, `/#instructor`, `/lounge/`, `/#plan`, `/#schedule`, `/#access`, and `/first-time/`) and valid root-relative `/pdf/member_agreement.pdf` link in `/include/footer.html`.

- [ ] **Step 1: Initialize git repository (if not initialized) and write the failing test `tests/header-footer.test.mjs`**

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test "C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\header-footer.test.mjs"`
Expected: FAIL (`Missing nav item: プログラム`)

- [ ] **Step 3: Update `include/header.html`, `include/footer.html`, and `common/css/common.css`**

Update `include/header.html` so desktop `.nav` and mobile `#gloval-nav` contain the exact gentle navigation items from `riverpark_top_gentle_fullpage.jpg` (`コンセプト` -> `/#concept`, `プログラム` -> `/#program`, `インストラクター` -> `/#instructor`, `ワークラウンジ` -> `/lounge/`, `プラン` -> `/#plan`, `スケジュール` -> `/#schedule`, `アクセス` -> `/#access`, plus `.head_contact` `体験のご予約はこちら`). Update `include/footer.html` to reference `/pdf/member_agreement.pdf` and `/#access`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test "C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\header-footer.test.mjs"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add include/header.html include/footer.html common/css/common.css tests/header-footer.test.mjs
git commit -m "feat(nav): align header and footer navigation with gentle redesign"
```

---

### Task 2: Gentle Top Page (`index.html`, `css/top.css`) & Lifestyle Image Assets

**Files:**
- Create: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\top-page.test.mjs`
- Create: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\img\top\insta_gallery_coffee.jpg` (via `image-generator` or cropped from generated gentle assets)
- Modify: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\index.html:1-583`
- Modify: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\css\top.css:1-2438`

**Interfaces:**
- Consumes: Existing images (`img/top/mv1.jpg`, `img/top/mv3.jpg`, `img/top/mv4.jpg`, `img/top/facility_img2_1.jpg`, `img/top/service_img1.jpg`, `img/top/service_img2.jpg`, `img/top/service_img3.jpg`, `img/top/facility_img2_3.jpg`, `img/top/service_img4.jpg`, `studio/img/inst_ayumi.jpg`, `studio/img/inst_chisato.png`, `studio/img/inst_yuhei.jpg`, `bouldering/img/inst_asari.jpg`, `img/top/free_pass_img1.jpg`, `img/top/free_pass_img2.jpg`, `img/top/free_pass_img3.jpg`).
- Produces: Complete gentle Top Page (`index.html`) matching `riverpark_top_gentle_fullpage.jpg` with sections `#concept`, `#space-comfort`, `#program`, `#instructor`, `#plan`, `#schedule`, `#insta`, `#access`, `#contact`, and `<script type="application/ld+json">` structured data.

- [ ] **Step 1: Write the failing test `tests/top-page.test.mjs`**

```javascript
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
  assert.ok(!html.includes('リーパス会員'), 'Typo リーパス会員 must be fixed to フリーパス会員');
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test "C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\top-page.test.mjs"`
Expected: FAIL (`Missing required content in index.html: SPACE &amp; COMFORT`)

- [ ] **Step 3: Implement `index.html` and `css/top.css` matching `riverpark_top_gentle_fullpage.jpg`**

Update `index.html` and `css/top.css` with:
1. Unobstructed Hero Swiper (`mv1.jpg`, `mv3.jpg`, `mv4.jpg`) with zero text overlay.
2. `#concept` section on pure white (`padding: 80px 0; width: 930px; margin: 0 auto`) with sky-blue `#72bcd9` heading `「わたしと自然が心地よくつながる毎日を、ここから。」` and spacious poetic lines.
3. `#space-comfort` overlapping editorial block (`.rental`-style layout using `img/top/facility_img2_1.jpg` on the left and overlapping pure white `.element_box` on the right titled `SPACE & COMFORT / 自然光と多摩川の風に包まれる空間` with outlined pill button `初めての方へ` linking to `first-time/`).
4. `#program` section on `#fafafa` (`padding: 80px 0`) with left-aligned `#72bcd9` heading `PROGRAM / プログラム` and 4 unobstructed circular photos (`217px × 217px`, `border-radius: 50%`) for `Studio Yoga & Pilates` (`深い呼吸で、心とからだをほどく` -> `studio/`), `Bouldering` (`パズルのように夢中で身体を動かす` -> `bouldering/`), `River SUP` (`水の上で、自然とひとつになる` -> `outdoorfitness-program/`), and `Work Lounge` (`川を眺めながら、静かに自分と向き合う` -> `lounge/`), plus a subtle link to `kids/` (`キッズスクールはこちら`).
5. `#instructor` section on pure white (`padding: 80px 0`) with left-aligned `#72bcd9` heading `INSTRUCTOR / インストラクター`, gentle intro line `経験豊かなインストラクターが、一人ひとりのペースに合わせて丁寧にお迎えします。`, and 4 circular natural portraits (`Ayumi`, `Chisato`, `YUHEI`, `あさり`) with `Profile` outlined pill buttons.
6. `#plan` section with clean, non-salesy comparison table (`プラン項目` / `ドロップイン（都度利用）` / `フリーパス会員`), valid links on every row, and outlined pill button `詳しい料金・スケジュールを見る`.
7. Quiet 6-photo river/studio gallery strip linking to `@riverpark.tokyo`, `#facility` collapsible/modal floor map access, `#access` with station route (`京王線 聖蹟桜ヶ丘駅 東口より多摩川方面へ徒歩約5分`), KEIO & NAS logos with accurate `alt` tags, and `JSON-LD` (`HealthClub` / `SportsActivityLocation`) in `<head>`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test "C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\top-page.test.mjs"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html css/top.css img/top/ tests/top-page.test.mjs
git commit -m "feat(top): implement gentle spacious top page design and SEO structured data"
```

---

### Task 3: Beginner-Friendly Program Explanations & Subpages (`first-time/`, `lounge/`, `studio/`, `outdoorfitness-program/`)

**Files:**
- Create: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\subpages.test.mjs`
- Create: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\common\css\subpage-gentle.css`
- Create: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\first-time\index.html`
- Create: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\lounge\index.html`
- Modify: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\studio\index.html:47-93`
- Modify: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\outdoorfitness-program\index.html:47-145`

**Interfaces:**
- Consumes: `common/css/common.css`, `common/js/common.js`, and existing facility/program photography.
- Produces:
  - `/first-time/index.html`: Gentle editorial guide for first-time visitors (how to spend a day, what to bring / free yoga mat & climbing shoe rental info, calm FAQ).
  - `/lounge/index.html`: Dedicated page for the 2F Riverview Coworking Lounge, Locker & Shower (Running Station), and Riverside Goods Rental.
  - Beginner-friendly "What is this program & what effects does it have?" guide blocks in `/studio/index.html` (explaining Yoga, Pilates, and TRX effects in plain language) and `/outdoorfitness-program/index.html` (explaining River SUP, Park Yoga, and Walk & Run effects, plus fixing the `#program1_7` Nordic Walking modal bug).

- [ ] **Step 1: Write the failing test `tests/subpages.test.mjs`**

```javascript
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
  const modal7Match = outdoor.match(/<div id="program1_7"[\s\S]*?<\/div>\s*<\/div>/);
  assert.ok(modal7Match, 'program1_7 modal must exist');
  assert.ok(modal7Match[0].includes('ノルディックウォーキング'), 'program1_7 must describe Nordic Walking');
  assert.ok(!modal7Match[0].includes('ボルダリングの経験が全くない'), 'program1_7 must not contain copy-pasted Bouldering text');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test "C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\subpages.test.mjs"`
Expected: FAIL (`ENOENT: no such file or directory, open '.../first-time/index.html'`)

- [ ] **Step 3: Create `common/css/subpage-gentle.css`, `first-time/index.html`, `lounge/index.html`, and update `studio/index.html` and `outdoorfitness-program/index.html`**

Implement the gentle subpage stylesheet (`common/css/subpage-gentle.css`) with generous white space (`#ffffff` / `#fafafa`), left-aligned `#72bcd9` headings, and soft cards. Create `first-time/index.html` and `lounge/index.html`. Add the beginner-friendly program & effect introduction blocks (with Instagram video links to `@riverpark.tokyo`) above the class lists in `studio/index.html` and `outdoorfitness-program/index.html`, and fix `#program1_7` in `outdoorfitness-program/index.html`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test "C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\subpages.test.mjs"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add common/css/subpage-gentle.css first-time/index.html lounge/index.html studio/index.html outdoorfitness-program/index.html tests/subpages.test.mjs
git commit -m "feat(subpages): add first-time and lounge pages and beginner program effect guides"
```

---

### Task 4: Full-Site Link Integrity & Live Browser Visual Verification

**Files:**
- Create: `C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\site-integrity.test.mjs`

**Interfaces:**
- Consumes: All modified HTML/CSS files served at `http://localhost:8080/`.
- Produces: Verified zero-broken-link test suite and visual inspection confirmation via Playwright on desktop (`1440px`) and mobile (`390px`).

- [ ] **Step 1: Write the site integrity test `tests/site-integrity.test.mjs`**

```javascript
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
```

- [ ] **Step 2: Run full test suite (`node --test`)**

Run: `node --test "C:\Users\fc3sl\.gemini\antigravity\scratch\riverpark-seiseki\tests\*.test.mjs"`
Expected: PASS (all tests green)

- [ ] **Step 3: Verify rendered pages in Playwright (`http://localhost:8080/`)**

Navigate to `http://localhost:8080/` and `http://localhost:8080/first-time/` and `http://localhost:8080/studio/` using Playwright to verify that the spacing, typography, circular images, and gentle atmosphere match `riverpark_top_gentle_fullpage.jpg` with zero console or network 404 errors.

- [ ] **Step 4: Commit**

```bash
git add tests/site-integrity.test.mjs
git commit -m "test: add full-site link and asset integrity verification"
```
