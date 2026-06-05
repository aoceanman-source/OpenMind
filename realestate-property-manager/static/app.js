// 業務端查詢後台 — 與 FastAPI 後端對接
const $ = (id) => document.getElementById(id);

// ── 格式化 ──
const oku = (jpy) => (jpy / 1e8).toFixed(2);                       // 億
const yen = (n) => "¥" + Math.round(n).toLocaleString("ja-JP");
const twd = (n) => "NT$" + Math.round(n).toLocaleString("zh-TW");
const okuYen = (jpy) => "¥" + oku(jpy) + " 億";
const okuTwd = (twdv) => "NT$" + oku(twdv) + " 億";

// ── 載入統計 + 下拉選單 ──
async function loadStats() {
  const s = await (await fetch("/api/stats")).json();
  $("statCount").textContent = s.property_count;
  $("statValueTwd").textContent = okuTwd(s.total_value_twd);
  $("statValueJpy").textContent = okuYen(s.total_value_jpy);
  $("statYield").textContent = s.avg_gross_yield + "%";

  const pref = $("fPref"), sales = $("fSales");
  s.prefectures.forEach((p) => pref.add(new Option(p, p)));
  s.sales.forEach((p) => sales.add(new Option(p, p)));
}

// ── 載入物件清單 ──
async function loadProperties() {
  const params = new URLSearchParams();
  if ($("fQ").value) params.set("q", $("fQ").value);
  if ($("fPref").value) params.set("prefecture", $("fPref").value);
  if ($("fStatus").value) params.set("status", $("fStatus").value);
  if ($("fSales").value) params.set("sales", $("fSales").value);
  if ($("fYield").value) params.set("min_yield", $("fYield").value);
  if ($("fPrice").value) params.set("max_price_jpy", $("fPrice").value * 1e8);

  const list = await (await fetch("/api/properties?" + params)).json();
  $("resultCount").textContent = list.length;
  const grid = $("propGrid");
  if (!list.length) {
    grid.innerHTML = '<div class="empty">查無符合條件的物件，試著放寬篩選。</div>';
    return;
  }
  grid.innerHTML = list.map(cardHTML).join("");
  document.querySelectorAll(".card").forEach((el) =>
    el.addEventListener("click", () => openDrawer(el.dataset.id))
  );
}

function cardHTML(p) {
  const m = p.metrics;
  return `
  <article class="card" data-id="${p.id}">
    <div class="card__top">
      <div>
        <div class="card__code mono">${p.code}</div>
        <div class="card__name">${p.name}</div>
        <div class="card__loc">${p.prefecture || ""}${p.city || ""}・${p.nearest_station || ""} 徒步${p.walk_minutes || "—"}分</div>
      </div>
      <span class="badge badge--${p.status}">${p.status}</span>
    </div>
    <div class="card__yield">
      <span class="card__yield-num">${m.gross_yield}%</span>
      <span class="card__yield-label">表面利回り<br>現況 ${m.current_yield}%</span>
    </div>
    <div class="card__price">
      <b>${okuTwd(m.price_twd)}</b>
      <span class="card__price-sub">／ ${okuYen(m.price_jpy)}</span>
    </div>
    <div class="card__foot">
      <span>空室率 ${m.vacancy_rate}%・${m.floor_count} 層</span>
      <span>${p.assigned_sales || ""}</span>
    </div>
  </article>`;
}

// ── 詳細抽屜 ──
async function openDrawer(id) {
  const p = await (await fetch("/api/properties/" + id)).json();
  const m = p.metrics;

  const fact = (label, val) => `<div class="d-fact"><span>${label}</span><span>${val ?? "—"}</span></div>`;
  const facts = [
    fact("所在地", `${p.prefecture || ""}${p.city || ""}`),
    fact("詳細地址", p.address),
    fact("最寄り駅", `${p.nearest_station || "—"} 徒步${p.walk_minutes || "—"}分`),
    fact("規模", `地上${p.floors_above || 0}階 / 地下${p.floors_below || 0}階`),
    fact("構造", p.structure),
    fact("築年", `${p.built_year || "—"}年${p.built_month || ""}月`),
    fact("土地面積", `${(p.land_area_sqm || 0).toLocaleString()} ㎡`),
    fact("延床面積", `${(p.gross_floor_area_sqm || 0).toLocaleString()} ㎡`),
    fact("權利型態", p.ownership_type),
    fact("耐震", p.earthquake_standard),
    fact("固定資產稅/年", yen(p.property_tax_jpy || 0)),
    fact("管理修繕費/年", yen(p.management_fee_jpy || 0)),
  ].join("");

  const rows = p.floors.map((f) => {
    const vac = f.status !== "賃貸中";
    const tenant = f.tenant_name
      ? `${f.tenant_name}${f.tenant_industry ? `<br><small style="color:#999">${f.tenant_industry}</small>` : ""}`
      : "—";
    return `<tr class="${vac ? "vacant" : ""}">
      <td>${f.floor_label || ""}${f.unit ? " " + f.unit : ""}</td>
      <td class="num">${f.area_tsubo}</td>
      <td><span class="tag-status ${vac ? "is-vacant" : ""}">${f.status}</span></td>
      <td>${tenant}</td>
      <td class="num">${vac ? "—" : yen(f.monthly_rent_jpy)}</td>
      <td class="num">${vac ? "—" : yen(f.monthly_common_fee_jpy)}</td>
    </tr>`;
  }).join("");

  $("drawerBody").innerHTML = `
    <div class="d-code mono">${p.code}　<span class="badge badge--${p.status}">${p.status}</span></div>
    <h2 class="d-name">${p.name}</h2>
    <div class="d-loc">${p.prefecture || ""}${p.city || ""}　${p.address || ""}</div>

    <div class="d-metrics">
      <div class="d-metric"><div class="d-metric__num accent">${m.gross_yield}%</div><div class="d-metric__label">表面利回り</div></div>
      <div class="d-metric"><div class="d-metric__num">${m.current_yield}%</div><div class="d-metric__label">現況利回り</div></div>
      <div class="d-metric"><div class="d-metric__num">${m.vacancy_rate}%</div><div class="d-metric__label">空室率</div></div>
      <div class="d-metric"><div class="d-metric__num">${okuTwd(m.price_twd)}</div><div class="d-metric__label">販售價格(台幣)</div></div>
      <div class="d-metric"><div class="d-metric__num">${okuYen(m.price_jpy)}</div><div class="d-metric__label">販售價格(日圓)</div></div>
      <div class="d-metric"><div class="d-metric__num">${m.total_area_tsubo}</div><div class="d-metric__label">總面積(坪)</div></div>
    </div>

    <div class="d-section-title">建物概要</div>
    <div class="d-facts">${facts}</div>

    <div class="d-section-title">レントロール（${m.floor_count}層）・滿室想定年收 ${yen(m.full_annual_income_jpy)}</div>
    <table class="rent-table">
      <thead><tr><th>樓層/區劃</th><th>面積(坪)</th><th>現況</th><th>租客 / 業種</th><th>月租金</th><th>共益費</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr>
        <td>合計</td><td class="num">${m.total_area_tsubo}</td><td>入居 ${m.occupancy_rate}%</td>
        <td></td><td class="num">${yen(m.full_monthly_income_jpy)}</td><td></td>
      </tr></tfoot>
    </table>

    <div class="d-actions">
      <a class="btn btn--primary" href="/property/${p.id}/report.xlsx">⬇ 匯出物件概要書 (Excel)</a>
      <a class="btn btn--ghost" href="/property/${p.id}/report" target="_blank">🖨 列印 / 存成 PDF</a>
    </div>
  `;
  $("overlay").classList.add("open");
  $("drawer").classList.add("open");
}

function closeDrawer() {
  $("overlay").classList.remove("open");
  $("drawer").classList.remove("open");
}

// ── 事件綁定 ──
["fQ", "fPref", "fStatus", "fSales", "fYield", "fPrice"].forEach((id) => {
  const ev = id === "fQ" || id === "fYield" || id === "fPrice" ? "input" : "change";
  $(id).addEventListener(ev, debounce(loadProperties, 250));
});
$("fReset").addEventListener("click", () => {
  ["fQ", "fPref", "fStatus", "fSales", "fYield", "fPrice"].forEach((id) => ($(id).value = ""));
  loadProperties();
});
$("drawerClose").addEventListener("click", closeDrawer);
$("overlay").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeDrawer());

function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// ── 啟動 ──
loadStats();
loadProperties();
