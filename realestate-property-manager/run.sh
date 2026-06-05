#!/usr/bin/env bash
# 一鍵啟動：建立虛擬環境 → 安裝套件 → 灌範例資料 → 啟動伺服器
set -e
cd "$(dirname "$0")"

if [ ! -d ".venv" ]; then
  echo "→ 建立虛擬環境..."
  python3 -m venv .venv
fi
source .venv/bin/activate

echo "→ 安裝套件..."
pip install -q -r requirements.txt

if [ ! -f "realestate.db" ]; then
  echo "→ 首次啟動，灌入範例資料..."
  python -m app.seed
fi

echo "→ 啟動伺服器： http://127.0.0.1:8000"
uvicorn app.main:app --reload
