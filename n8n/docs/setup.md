# OpenMind Studio Chat API — n8n 環境設定

## 前置需求

- n8n 已安裝並可從外部存取（建議使用 n8n Cloud 或自架加 ngrok/反向代理）
- Google Gemini API Key
- Redis 實例（可用 Redis Cloud 免費方案或本地 Docker）
- Google Sheets API 憑證（OAuth2）

---

## 步驟一：匯入 Workflow

1. 在 n8n 左側選單點「Workflows」→「Import from file」
2. 選擇 `workflow-openmind-chat.json`
3. 匯入後先**不要啟用**，完成所有設定再啟用

---

## 步驟二：設定憑證

### Google Gemini (PaLM) API
1. n8n → Settings → Credentials → New Credential → 搜尋「Google Gemini」
2. 填入 API Key（從 Google AI Studio 取得）
3. 建立後複製 Credential ID
4. 在 workflow 的 **Gemini Chat Model** 節點選擇此憑證

### Redis
1. n8n → Settings → Credentials → New Credential → 搜尋「Redis」
2. 填入 Host、Port（預設 6379）、Password（如有）
3. 在 **Redis Chat Memory** 和 **Clear Session** 節點選擇此憑證

### Google Sheets OAuth2
1. n8n → Settings → Credentials → New Credential → 搜尋「Google Sheets OAuth2」
2. 完成 Google OAuth 授權流程
3. 在 **Save Lead** 節點選擇此憑證

---

## 步驟三：設定 Google Sheets

1. 建立新的 Google Sheets 試算表
2. 在第一個分頁（或新增分頁）命名為「詢問紀錄」
3. 第一列填入以下標題（順序不限但名稱必須完全相符）：

```
姓名 | 聯絡方式 | 電話號碼 | 公司 | 產業 | 推薦方案 | 需求說明 | 建立時間
```

4. 複製試算表 URL 中的 ID（`/spreadsheets/d/` 後面到下一個 `/` 之間的字串）
5. 在 **Save Lead** 節點的 Document ID 填入此 ID

---

## 步驟四：取得 Webhook URL

1. 在 n8n 中開啟 workflow
2. 點擊 **Chat Webhook** 節點
3. 複製「Production URL」，格式為：
   ```
   https://your-n8n-instance.com/webhook/openmind-chat
   ```
4. 這個 URL 就是前端要呼叫的 API endpoint

---

## 步驟五：啟用 Workflow

1. 確認所有憑證都已設定
2. 點擊右上角的 toggle 切換為 Active

---

## 測試

```bash
# 測試基本連線
curl -X POST https://your-n8n-instance.com/webhook/openmind-chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-001","message":"你好，請問你們有什麼服務？"}'

# 預期回應
# {"reply":"你好！我是 OpenMind Studio 的 AI 助理小明..."}
```

---

## 注意事項

- `sessionId` 建議在前端用 `crypto.randomUUID()` 生成，存入 `localStorage`
- Redis TTL 設定為 7200 秒（2 小時），超時後對話記憶自動清除
- 完成諮詢流程後 Redis 會主動清除該 session，下次對話從頭開始
