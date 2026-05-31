# 網站 Chat Widget 串接說明

## API 規格

### Endpoint
```
POST https://your-n8n-instance.com/webhook/openmind-chat
Content-Type: application/json
```

### Request Body
```json
{
  "sessionId": "string (UUID v4，每個使用者唯一)",
  "message": "string (使用者輸入，最長 500 字)"
}
```

### Response
```json
{ "reply": "string (AI 回覆內容)" }
```

---

## 前端整合範例

### sessionId 管理

```javascript
function getSessionId() {
  let id = localStorage.getItem('openmind_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('openmind_session_id', id);
  }
  return id;
}

// 重置對話（使用者主動清除或關閉視窗時可選擇性呼叫）
function resetSession() {
  localStorage.removeItem('openmind_session_id');
}
```

### 傳送訊息

```javascript
async function sendMessage(userMessage) {
  const sessionId = getSessionId();

  const response = await fetch('https://your-n8n-instance.com/webhook/openmind-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message: userMessage })
  });

  if (!response.ok) {
    throw new Error('Network error');
  }

  const data = await response.json();
  return data.reply;
}
```

### 完整 Widget 範例（原生 JS）

```javascript
class OpenMindChat {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.sessionId = this.getOrCreateSession();
  }

  getOrCreateSession() {
    let id = localStorage.getItem('openmind_chat_session');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('openmind_chat_session', id);
    }
    return id;
  }

  async send(message) {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: this.sessionId, message })
    });

    const { reply } = await res.json();
    return reply;
  }

  resetConversation() {
    localStorage.removeItem('openmind_chat_session');
    this.sessionId = this.getOrCreateSession();
  }
}

// 使用方式
const chat = new OpenMindChat('https://your-n8n-instance.com/webhook/openmind-chat');

// 傳送訊息並顯示回覆
const reply = await chat.send('你好，請問你們有什麼服務？');
console.log(reply);
```

---

## 整合到現有 Widget（ai/chat-widget.js）

如果 OpenMind Studio 已有 chat widget，只需將原本直接呼叫 Gemini API 的部分改成呼叫 n8n webhook：

```javascript
// 原本（直接呼叫 Gemini）
const response = await callGeminiAPI(userMessage);

// 改成（透過 n8n，享有對話記憶 + Lead 自動存檔）
const response = await fetch(N8N_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: getSessionId(),
    message: userMessage
  })
}).then(r => r.json()).then(d => d.reply);
```

---

## CORS

n8n Webhook 節點的回應已設定 `Access-Control-Allow-Origin: *`，
若需要限制來源，請在 **Webhook Reply** 和 **Reply Error** 節點的 Response Headers 中
將 `*` 改為你的網域，例如 `https://openmind-studio.com`。
