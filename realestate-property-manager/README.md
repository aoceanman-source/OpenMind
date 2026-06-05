# 日本商辦物件管理系統

> 把分散的「一物件一 Excel」整併成一個關聯式資料庫，業務端隨時撈資料、一鍵匯出固定報表。
> OpenMind Studio 實作案例 — 不動產 × 自動化。

專為「銷售日本整棟商辦給台灣客戶」的不動產公司打造。每棟樓的逐層租約（レントロール）
集中管理，表面利回り、現況利回り、空室率全部即時自動計算，業務不用再手動對 Excel。

---

## 解決什麼問題？

| 以前（每物件一個 Excel） | 現在（這套系統） |
|---|---|
| 檔案各自為政，欄位每份不一樣 | 一個資料庫、統一欄位，可橫向比較 |
| 利回り、年收要手算、常算錯 | 改一格租金，所有指標自動重算 |
| 要找「利回り 5% 以上、東京、在庫」要一份份開 | 一個畫面即時篩選 |
| 給客戶的提案書手工排版 | 一鍵匯出格式一致的「物件概要書」 |

---

## 功能

- **物件 × 樓層關聯式資料庫**：物件主檔（一棟一筆）＋ 樓層/租約明細（レントロール）。
- **投資指標即時計算**：表面利回り（滿室想定）、現況利回り、空室率、滿室／現況年收、日圓↔台幣雙幣別。
- **業務查詢後台**：依地區、銷售狀態、負責業務、最低利回り、價格上限即時篩選；點開看完整租約。
- **一鍵固定報表**：中日雙語「物件概要書」
  - Excel 版（`.xlsx`，可再編輯）
  - 列印版（瀏覽器列印或存成 PDF，A4 排版）
- **舊資料搬遷**：把現有的一堆 Excel 批次匯入資料庫。

---

## 快速開始

```bash
# 方式一：一鍵腳本（自動建環境、裝套件、灌範例資料、啟動）
./run.sh

# 方式二：手動
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m app.seed              # 灌入 4 棟範例物件
uvicorn app.main:app --reload
```

開瀏覽器進 **http://127.0.0.1:8000** 即可看到業務後台。

---

## 專案結構

```
realestate-property-manager/
├── app/
│   ├── database.py     # 連線設定（SQLite 預設，可一鍵換 Supabase/Postgres）
│   ├── models.py       # 資料模型：Property（物件）─< Floor（樓層/租約）
│   ├── metrics.py      # 投資指標計算（利回り、空室率、年收…）
│   ├── schemas.py      # API 輸入驗證
│   ├── report.py       # 「物件概要書」Excel 產生器
│   ├── seed.py         # 範例資料
│   └── main.py         # FastAPI：API + 報表 + 後台
├── templates/
│   ├── index.html      # 業務查詢後台
│   └── report.html     # 列印版物件概要書
├── static/             # 後台前端（樣式、JS）
├── scripts/
│   ├── import_excel.py        # 舊 Excel 批次匯入
│   └── make_sample_excels.py  # 產生範例舊檔（示範搬遷）
└── requirements.txt
```

---

## 資料模型（系統核心）

把每個 Excel 拆成兩張用 `物件編號` 綁定的關聯式資料表：

- **物件主檔 `Property`**：編號、名稱、所在地、最寄り駅、構造、築年、土地/延床面積、
  販售價格、匯率、權利型態、耐震、銷售狀態、負責業務…
- **樓層/租約 `Floor`（レントロール）**：所屬物件、樓層、區劃、面積、現況（賃貸中/空室）、
  租客、業種、月租金、共益費、押金、契約期間…

> 月租金只在「樓層」層級輸入，物件層級的年收與利回り由 `metrics.py` 即時算出 ——
> 一處輸入、處處同步，這就是它取代 Excel 的關鍵。

---

## 把舊 Excel 搬進來

```bash
# 1) 產生兩個示範用的「舊版」Excel（實際使用時換成你自己的檔案）
python scripts/make_sample_excels.py

# 2) 把整個資料夾批次匯入（同物件編號會更新，可重複執行）
python scripts/import_excel.py scripts/sample_legacy
```

匯入版型：每個 `.xlsx` 含「物件概要」工作表（A 欄欄位名、B 欄值）與「レントロール」工作表
（表格）。面積以「坪」輸入，匯入時自動換算成 ㎡。真實專案只要照客戶各自的 Excel 調整
`import_excel.py` 裡的 `LABEL_MAP` 對照表即可。

---

## 升級到 Supabase / PostgreSQL（雲端、多人）

程式完全不用改，只要設一個環境變數：

```bash
export DATABASE_URL="postgresql+psycopg2://user:password@host:5432/dbname"
pip install "psycopg2-binary"
uvicorn app.main:app
```

資料模型、API、報表全部沿用，達到「先本機驗證、再無痛搬上雲」。

---

## 給業務的操作說明

1. **找物件**：上方輸入車站或物件名稱、或用下拉選地區/狀態/業務、填最低利回り或價格上限，清單即時更新（依利回り由高到低排序）。
2. **看細節**：點任一張物件卡 → 右側滑出完整建物概要 ＋ 逐層租約（空室會標紅）＋ 投資指標。
3. **出報表給客戶**：在細節頁按
   - 「⬇ 匯出物件概要書 (Excel)」下載 `.xlsx`，或
   - 「🖨 列印 / 存成 PDF」開列印版，瀏覽器列印時選「另存為 PDF」。

---

## 技術棧

FastAPI · SQLAlchemy · SQLite（可換 PostgreSQL/Supabase）· openpyxl · Jinja2 · 原生 HTML/CSS/JS

---

*本資料中的物件、租客、金額皆為示範用虛構資料。台幣金額依參考匯率換算，僅供參考。*
