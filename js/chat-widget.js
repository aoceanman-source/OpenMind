/* ─── OpenMind Studio AI 智能客服 Widget ─── */
(function () {
  'use strict';

  /* ── 知識庫：關鍵字 → 回覆 ── */
  const KB = [
    {
      keys: ['你好', 'hi', 'hello', '哈囉', '嗨', '您好', '早', '午', '晚'],
      reply: '你好！我是 OpenMind Studio 的 AI 助理 👋\n\n你可以問我關於服務項目、費用、開發時間，或是直接說明你的需求，我來幫你找最適合的方案！'
    },
    {
      keys: ['服務', '做什麼', '能做', '會做', '項目', '有哪些'],
      reply: '我們主要提供三大服務：\n\n💬 LINE Bot AI 客服\n自動回覆、預約引導、24/7 不間斷\n\n🔍 電商爬蟲自動化\n競品查價、價格監控、自動報表\n\n🌐 形象官網開發\n餐廳、美容、診所、通用官網\n\n想深入了解哪一項呢？'
    },
    {
      keys: ['line bot', 'linebot', 'line', 'bot', '機器人', '客服機器人'],
      reply: 'LINE Bot AI 客服 是我們的熱門服務！\n\n✅ 整合 RAG 知識庫，準確回答常見問題\n✅ 自動引導預約、收集潛在客戶資料\n✅ 超出範圍自動轉真人，不漏接\n✅ 客服工作量平均減少 60%\n\n開發週期：7–14 天\n有興趣可以直接聯絡我們詳談 👇'
    },
    {
      keys: ['爬蟲', '查價', '競品', '監控', '自動化', '價格', 'scraper'],
      reply: '電商競品查價爬蟲 幫你全自動監控市場！\n\n✅ 同時追蹤蝦皮、Momo、PChome 等 6 大平台\n✅ 價格一變動立即推送 LINE / Email 通知\n✅ 每日自動排程，完全不需人工介入\n✅ 每天省下 1–2 小時的手動查詢時間\n\n開發週期：5–10 天\n想知道更多細節嗎？'
    },
    {
      keys: ['官網', '網站', '網頁', '餐廳', '美容', '診所', '牙醫', '形象'],
      reply: '我們的官網模板涵蓋多種行業：\n\n🍜 餐廳官網（菜單 + 訂位 + Google Maps）\n💄 美容業官網（作品集 + 預約表單）\n🏥 診所官網（門診時間 + 掛號連結）\n🦷 牙醫美學診所（高端設計 + 預約）\n🏢 通用官網（各行業皆適用）\n\n全部 RWD 手機電腦完美適配，整合 LINE 諮詢按鈕。\n\n開發週期：7–14 天'
    },
    {
      keys: ['費用', '價格', '多少錢', '報價', '收費', '預算', '貴不貴'],
      reply: '費用依專案複雜度而定，以下是大概範圍：\n\n💬 LINE Bot AI 客服：洽談報價\n🔍 爬蟲自動化：洽談報價\n🌐 形象官網：洽談報價\n\n每個案子都是客製評估，建議直接告訴我你的需求，我們再提供精確報價。\n\n➡️ 免費諮詢：aoceanman@gmail.com\n或是直接填寫網站上的諮詢表單！'
    },
    {
      keys: ['時間', '多久', '開發時間', '交期', '幾天', '幾週'],
      reply: '開發時間依專案類型：\n\n⏱ LINE Bot AI 客服：7–14 天\n⏱ 爬蟲自動化：5–10 天\n⏱ 網站 AI 聊天 Widget：3–7 天\n⏱ 形象官網：7–14 天\n\n購買後享有 一個月無限修改 保證，確保滿意為止！'
    },
    {
      keys: ['修改', '售後', '保固', '維護', '保證'],
      reply: '我們提供 一個月無限修改 保證 🎯\n\n交付後如有任何需要調整的地方，在一個月內都可以免費修改，直到你滿意為止。\n\n另外也附有中文操作說明，讓你能輕鬆自行維護！'
    },
    {
      keys: ['聯絡', '怎麼聯絡', '如何聯絡', 'email', '信箱', '洽談', '諮詢'],
      reply: '歡迎透過以下方式聯絡我們 📬\n\n📧 Email：aoceanman@gmail.com\n\n或是直接在網站底部填寫「免費諮詢」表單，我會在 24 小時內回覆你！\n\n不用想好完整需求，把痛點說出來，我來幫你想解法 💡'
    },
    {
      keys: ['案例', '作品', '作品集', '成果', '展示', '範例'],
      reply: '你可以在「作品集」頁面看到所有實際案例 📁\n\n包含：LINE Bot AI 客服、電商爬蟲、網站 Widget、餐廳官網、美容官網、診所官網、牙醫診所、通用官網。\n\n每個案例都是實際可運行的專案，不是示意圖！\n\n➡️ 前往作品集：portfolio.html'
    },
    {
      keys: ['技術', '用什麼', '工具', 'python', 'javascript', 'gemini', 'firebase', 'ai'],
      reply: '我們使用業界主流技術：\n\n🤖 AI：Gemini Pro / RAG 知識庫\n🐍 後端：Python、Firebase\n🌐 前端：HTML/CSS/JavaScript\n🔗 整合：LINE API、Google Sheets API\n📊 爬蟲：Playwright、BeautifulSoup\n\n每個工具都是針對專案需求選擇，確保穩定且易於維護！'
    },
    {
      keys: ['謝謝', '感謝', '好的', 'ok', '了解', '明白', '清楚'],
      reply: '不客氣！😊\n\n如果還有其他問題，隨時都可以問我。或者直接透過以下方式聯絡我們：\n\n📧 aoceanman@gmail.com\n\n期待與你合作！🚀'
    },
    {
      keys: ['再見', '掰掰', 'bye', '拜拜'],
      reply: '掰掰！如果之後有任何問題歡迎再來找我 😊\n\n有任何自動化需求，OpenMind Studio 隨時幫你！'
    }
  ];

  const DEFAULT_REPLY = '感謝你的訊息！這個問題我需要轉交給真人來回覆你 🙋\n\n請透過以下方式聯絡我們：\n\n📧 aoceanman@gmail.com\n\n我們會在 24 小時內回覆！\n\n或是你可以問我：服務項目、費用、開發時間、聯絡方式…等問題哦！';

  function getReply(input) {
    const text = input.toLowerCase().trim();
    for (const entry of KB) {
      if (entry.keys.some(k => text.includes(k))) {
        return entry.reply;
      }
    }
    return DEFAULT_REPLY;
  }

  /* ── HTML 結構 ── */
  const WIDGET_HTML = `
<div id="om-chat-widget" aria-live="polite">
  <!-- 觸發按鈕 -->
  <div id="om-chat-fab" role="button" tabindex="0" aria-label="開啟 AI 客服">
    <svg id="om-icon-chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg id="om-icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
    <span id="om-unread-dot" style="display:none"></span>
  </div>

  <!-- 提示氣泡 -->
  <div id="om-chat-bubble" role="button" tabindex="0" aria-label="開啟 AI 客服">
    <span>👋 你好！有問題可以問我</span>
    <button id="om-bubble-close" aria-label="關閉提示">×</button>
  </div>

  <!-- 聊天視窗 -->
  <div id="om-chat-window" role="dialog" aria-label="OpenMind Studio AI 客服" aria-hidden="true">
    <div id="om-chat-header">
      <div id="om-chat-avatar">AI</div>
      <div id="om-chat-title">
        <strong>OpenMind Studio</strong>
        <span>AI 助理 · 通常即時回覆</span>
      </div>
      <button id="om-chat-minimize" aria-label="最小化">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
    <div id="om-chat-messages"></div>
    <div id="om-quick-replies">
      <button class="om-qr" data-msg="你們有哪些服務？">服務項目</button>
      <button class="om-qr" data-msg="費用大概多少？">費用詢問</button>
      <button class="om-qr" data-msg="開發時間需要多久？">開發時間</button>
      <button class="om-qr" data-msg="如何聯絡你們？">聯絡方式</button>
    </div>
    <div id="om-chat-input-row">
      <textarea id="om-chat-input" placeholder="輸入訊息…" rows="1" aria-label="輸入訊息"></textarea>
      <button id="om-chat-send" aria-label="送出">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </div>
</div>`;

  /* ── CSS ── */
  const WIDGET_CSS = `
#om-chat-widget {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  font-family: 'Noto Sans TC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

/* FAB 按鈕 */
#om-chat-fab {
  width: 56px;
  height: 56px;
  background: #111;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.28);
  transition: transform .25s, box-shadow .25s;
  position: relative;
  user-select: none;
}
#om-chat-fab:hover { transform: scale(1.08); box-shadow: 0 8px 28px rgba(0,0,0,0.32); }
#om-chat-fab:focus-visible { outline: 2px solid #111; outline-offset: 3px; }

/* 未讀紅點 */
#om-unread-dot {
  position: absolute;
  top: 4px; right: 4px;
  width: 10px; height: 10px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid #fff;
  animation: om-pulse 2s ease infinite;
}
@keyframes om-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: .7; }
}

/* 提示氣泡 */
#om-chat-bubble {
  position: absolute;
  bottom: 68px;
  right: 0;
  background: #fff;
  border: 1px solid #e8e5df;
  border-radius: 12px 12px 2px 12px;
  padding: 10px 14px 10px 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.14);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  animation: om-fadeup .4s ease;
  font-size: 13px;
  color: #111;
}
#om-chat-bubble span { pointer-events: none; }
#om-bubble-close {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}
#om-bubble-close:hover { color: #111; }
@keyframes om-fadeup {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 聊天視窗 */
#om-chat-window {
  position: absolute;
  bottom: 68px;
  right: 0;
  width: 340px;
  max-height: 520px;
  background: #fff;
  border: 1px solid #e8e5df;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: om-fadeup .3s ease;
  transform-origin: bottom right;
}
#om-chat-window[aria-hidden="true"] { display: none; }

/* 標題列 */
#om-chat-header {
  background: #111;
  color: #fff;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
#om-chat-avatar {
  width: 36px; height: 36px;
  background: #fff;
  color: #111;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .05em;
  flex-shrink: 0;
}
#om-chat-title { flex: 1; }
#om-chat-title strong { display: block; font-size: 13px; font-weight: 600; letter-spacing: .03em; }
#om-chat-title span { font-size: 11px; color: rgba(255,255,255,.55); }
#om-chat-minimize {
  background: none; border: none; color: rgba(255,255,255,.7);
  cursor: pointer; padding: 4px; display: flex; align-items: center;
  border-radius: 4px; transition: color .2s;
}
#om-chat-minimize:hover { color: #fff; }

/* 訊息區 */
#om-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
}
#om-chat-messages::-webkit-scrollbar { width: 4px; }
#om-chat-messages::-webkit-scrollbar-thumb { background: #e0ddd8; border-radius: 2px; }

/* 氣泡 */
.om-msg { display: flex; gap: 8px; animation: om-fadeup .25s ease; }
.om-msg.om-bot .om-bubble {
  background: #f5f0eb;
  color: #111;
  border-radius: 2px 12px 12px 12px;
  white-space: pre-line;
  font-size: 13px;
  line-height: 1.7;
  padding: 10px 13px;
  max-width: 85%;
  border: 1px solid #e8e5df;
}
.om-msg.om-user { justify-content: flex-end; }
.om-msg.om-user .om-bubble {
  background: #111;
  color: #fff;
  border-radius: 12px 2px 12px 12px;
  font-size: 13px;
  line-height: 1.7;
  padding: 10px 13px;
  max-width: 80%;
}
.om-msg-av {
  width: 28px; height: 28px;
  background: #111;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: .04em;
}

/* 打字中動畫 */
.om-typing .om-bubble {
  display: flex; align-items: center; gap: 4px;
  padding: 12px 14px !important;
}
.om-typing .om-bubble span {
  width: 6px; height: 6px;
  background: #999;
  border-radius: 50%;
  animation: om-bounce .9s ease infinite;
}
.om-typing .om-bubble span:nth-child(2) { animation-delay: .15s; }
.om-typing .om-bubble span:nth-child(3) { animation-delay: .3s; }
@keyframes om-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
}

/* 快速回覆 */
#om-quick-replies {
  padding: 4px 14px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex-shrink: 0;
}
.om-qr {
  font-size: 11px;
  padding: 5px 11px;
  border: 1px solid #d8d3ce;
  background: transparent;
  color: #555;
  cursor: pointer;
  border-radius: 2px;
  font-family: inherit;
  transition: all .2s;
  white-space: nowrap;
}
.om-qr:hover { background: #111; color: #fff; border-color: #111; }

/* 輸入列 */
#om-chat-input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 14px 14px;
  border-top: 1px solid #e8e5df;
  flex-shrink: 0;
}
#om-chat-input {
  flex: 1;
  border: none;
  border-bottom: 1px solid #d8d3ce;
  padding: 6px 0;
  font-size: 13px;
  font-family: inherit;
  color: #111;
  background: transparent;
  resize: none;
  outline: none;
  line-height: 1.5;
  max-height: 80px;
  transition: border-color .2s;
}
#om-chat-input:focus { border-bottom-color: #111; }
#om-chat-input::placeholder { color: #bbb; }
#om-chat-send {
  width: 32px; height: 32px;
  background: #111;
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background .2s;
}
#om-chat-send:hover { background: #333; }
#om-chat-send:disabled { background: #ccc; cursor: not-allowed; }

/* RWD */
@media (max-width: 480px) {
  #om-chat-widget { bottom: 16px; right: 16px; }
  #om-chat-window { width: calc(100vw - 32px); right: 0; bottom: 72px; }
  #om-chat-bubble { right: 0; }
}`;

  /* ── 注入 DOM ── */
  function init() {
    const style = document.createElement('style');
    style.textContent = WIDGET_CSS;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.innerHTML = WIDGET_HTML;
    document.body.appendChild(div.firstElementChild);

    const fab       = document.getElementById('om-chat-fab');
    const window_   = document.getElementById('om-chat-window');
    const bubble    = document.getElementById('om-chat-bubble');
    const bubbleX   = document.getElementById('om-bubble-close');
    const messages  = document.getElementById('om-chat-messages');
    const input     = document.getElementById('om-chat-input');
    const sendBtn   = document.getElementById('om-chat-send');
    const minimize  = document.getElementById('om-chat-minimize');
    const iconChat  = document.getElementById('om-icon-chat');
    const iconClose = document.getElementById('om-icon-close');
    const unreadDot = document.getElementById('om-unread-dot');
    const quickReplies = document.querySelectorAll('.om-qr');

    let isOpen = false;
    let bubbleHidden = false;
    let sending = false;

    /* 開啟 / 關閉視窗 */
    function openChat() {
      isOpen = true;
      window_.setAttribute('aria-hidden', 'false');
      bubble.style.display = 'none';
      iconChat.style.display = 'none';
      iconClose.style.display = 'block';
      unreadDot.style.display = 'none';
      input.focus();
      scrollToBottom();
      if (messages.children.length === 0) showWelcome();
    }

    function closeChat() {
      isOpen = false;
      window_.setAttribute('aria-hidden', 'true');
      iconChat.style.display = 'block';
      iconClose.style.display = 'none';
    }

    function toggleChat() {
      isOpen ? closeChat() : openChat();
    }

    fab.addEventListener('click', toggleChat);
    fab.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleChat(); } });
    minimize.addEventListener('click', closeChat);
    bubble.addEventListener('click', e => { if (e.target !== bubbleX) openChat(); });
    bubble.addEventListener('keydown', e => { if (e.key === 'Enter') openChat(); });
    bubbleX.addEventListener('click', e => {
      e.stopPropagation();
      bubble.style.display = 'none';
      bubbleHidden = true;
    });

    /* 捲到底部 */
    function scrollToBottom() {
      messages.scrollTop = messages.scrollHeight;
    }

    /* 顯示歡迎訊息 */
    function showWelcome() {
      addBotMsg('你好！我是 OpenMind Studio 的 AI 助理 👋\n\n有任何關於服務、費用或合作的問題，都可以直接問我！\n\n也可以點下方的快速選項 👇');
    }

    /* 加入 Bot 訊息 */
    function addBotMsg(text) {
      const row = document.createElement('div');
      row.className = 'om-msg om-bot';
      row.innerHTML = `<div class="om-msg-av">AI</div><div class="om-bubble">${escapeHtml(text)}</div>`;
      messages.appendChild(row);
      scrollToBottom();
    }

    /* 加入用戶訊息 */
    function addUserMsg(text) {
      const row = document.createElement('div');
      row.className = 'om-msg om-user';
      row.innerHTML = `<div class="om-bubble">${escapeHtml(text)}</div>`;
      messages.appendChild(row);
      scrollToBottom();
    }

    /* 打字動畫 */
    function showTyping() {
      const row = document.createElement('div');
      row.className = 'om-msg om-bot om-typing';
      row.id = 'om-typing-indicator';
      row.innerHTML = `<div class="om-msg-av">AI</div><div class="om-bubble"><span></span><span></span><span></span></div>`;
      messages.appendChild(row);
      scrollToBottom();
    }

    function hideTyping() {
      const el = document.getElementById('om-typing-indicator');
      if (el) el.remove();
    }

    /* 送出訊息 */
    function sendMessage(text) {
      text = text.trim();
      if (!text || sending) return;
      sending = true;
      sendBtn.disabled = true;

      addUserMsg(text);
      input.value = '';
      input.style.height = 'auto';

      showTyping();
      setTimeout(() => {
        hideTyping();
        const reply = getReply(text);
        addBotMsg(reply);
        sending = false;
        sendBtn.disabled = false;
        input.focus();
      }, 800 + Math.random() * 600);
    }

    sendBtn.addEventListener('click', () => sendMessage(input.value));

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input.value);
      }
    });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 80) + 'px';
    });

    quickReplies.forEach(btn => {
      btn.addEventListener('click', () => {
        sendMessage(btn.dataset.msg);
      });
    });

    /* 顯示未讀提示（3 秒後） */
    setTimeout(() => {
      if (!isOpen && !bubbleHidden) {
        unreadDot.style.display = 'block';
      }
    }, 3000);

    /* HTML 轉義 */
    function escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
    }
  }

  /* 等 DOM 載入完成後初始化 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
