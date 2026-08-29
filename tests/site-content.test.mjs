import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const homepage = read('index.html');
const stylesheet = read('css/style.css');
const script = read('js/main.js');

for (const service of ['中小企業形象官網', 'LINE 官方帳號建置', '短影音剪輯', '流程自動化']) {
  assert.match(homepage, new RegExp(service), `首頁必須呈現「${service}」`);
}

for (const page of ['website.html', 'line-oa.html', 'automation.html', 'short-video.html']) {
  assert.ok(existsSync(resolve(root, 'work', page)), `缺少案例頁 work/${page}`);
}

for (const oldClaim of ['LINE 智能客服', '一個月無限修改', '低於市場價格', '每一個案例都是實際可運行']) {
  assert.doesNotMatch(homepage, new RegExp(oldClaim), `首頁不應保留未驗證主張「${oldClaim}」`);
}

assert.match(stylesheet, /prefers-reduced-motion/, '樣式必須尊重減少動態效果偏好');
assert.match(script, /aria-expanded/, '行動選單必須維護 aria-expanded');

const videoPage = read('work/short-video.html');
for (const videoId of ['product-promo', 'interior-showcase', 'event-highlight']) {
  assert.match(videoPage, new RegExp(videoId), `短影音頁缺少 ${videoId} 展示位置`);
}
assert.doesNotMatch(videoPage, /大會人心/, '短影音案例不得挪用大會人心內容');

console.log('Portfolio content contract: PASS');
