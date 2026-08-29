# Four-service portfolio implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the automation-first landing page with an honest editorial portfolio for four approved services and four case-study pages.

**Architecture:** Keep this as a dependency-free static site. `index.html` provides the conversion path; four `work/` documents share the site CSS and a small progressive-enhancement script. A Node assertion script guards the published information architecture and non-claim requirements.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, Node.js built-in `fs` and `assert`.

**Spec:** `docs/superpowers/specs/2026-08-29-four-service-portfolio-design.md`

## Global Constraints

- Use no framework, build tool, stock imagery, invented client results, or unsupported guarantees.
- State case provenance using exactly `自有實作`, `概念示範`, or `成片待交付`.
- Keep short-video assets named `media/product-promo.mp4`, `media/interior-showcase.mp4`, and `media/event-highlight.mp4` when supplied.
- Ensure all local portfolio links resolve from their page locations.

---

### Task 1: Publishable content contract

**Files:**
- Create: `tests/site-content.test.mjs`
- Modify: `index.html`
- Create: `work/website.html`
- Create: `work/line-oa.html`
- Create: `work/automation.html`
- Create: `work/short-video.html`

**Interfaces:**
- Consumes: the service names and case labels in the design spec.
- Produces: four local case paths used by homepage cards.

- [ ] **Step 1: Write the failing test**

```js
assert.match(homepage, /中小企業形象官網/);
assert.match(homepage, /LINE 官方帳號建置/);
assert.match(homepage, /短影音剪輯/);
assert.match(homepage, /流程自動化/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/site-content.test.mjs`

Expected: an assertion failure because the legacy homepage does not contain the new service contract.

- [ ] **Step 3: Write minimal implementation**

Replace the legacy claims with the four approved services and create four HTML case paths. Give each case a required provenance label and give the video case the three required video identifiers.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/site-content.test.mjs`

Expected: all content assertions pass.

- [ ] **Step 5: Commit**

```bash
git add index.html work tests
git commit -m "feat: add four-service portfolio content"
```

### Task 2: Editorial visual system and responsive interaction

**Files:**
- Modify: `css/style.css`
- Modify: `js/main.js`
- Test: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: the section and class names created in Task 1.
- Produces: responsive layout, accessible menu behavior and reduced-motion-safe reveals.

- [ ] **Step 1: Extend the failing test**

```js
assert.match(stylesheet, /prefers-reduced-motion/);
assert.match(script, /aria-expanded/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/site-content.test.mjs`

Expected: an assertion failure because legacy styling has neither required contract.

- [ ] **Step 3: Write minimal implementation**

Build warm-paper, ink, and deep-green variables; apply editorial grid typography; add responsive rules, focus styles, and an accessible nav toggle that maintains `aria-expanded`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/site-content.test.mjs`

Expected: all content and interaction-contract assertions pass.

- [ ] **Step 5: Commit**

```bash
git add css/style.css js/main.js tests/site-content.test.mjs
git commit -m "feat: style editorial portfolio"
```

### Task 3: Verify and publish

**Files:**
- Verify: `index.html`, `work/*.html`, `css/style.css`, `js/main.js`, `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: the completed static site.
- Produces: a pushed Vercel production deployment.

- [ ] **Step 1: Run automated contract check**

Run: `node tests/site-content.test.mjs`

Expected: exit code 0.

- [ ] **Step 2: Verify served pages**

Run: `python3 -m http.server 4173 --directory .` and request `/`, then each `/work/*.html` page.

Expected: each response is HTTP 200 and the main page has the four case links.

- [ ] **Step 3: Review production diff**

Run: `git diff --check HEAD` and `git status --short`.

Expected: no whitespace errors and only intended files staged for publishing.

- [ ] **Step 4: Push the Vercel production branch**

Run: `git push origin claude/brand-positioning-workshop-2EVn4`.

Expected: remote accepts the commit; then verify the Vercel deployment URL responds with the new title.
