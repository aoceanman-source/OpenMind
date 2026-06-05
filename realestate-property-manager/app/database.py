"""資料庫連線設定。

預設使用 SQLite（零設定，clone 下來即可跑）。
要升級成 Supabase / PostgreSQL 時，完全不用改程式，只要設環境變數：

    export DATABASE_URL="postgresql+psycopg2://user:password@host:5432/dbname"

資料模型、API、報表全部沿用，達到「先本機跑、再無痛搬上雲」。
"""
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./realestate.db")

# SQLite 在多執行緒（FastAPI）下需要關掉同執行緒檢查
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI 依賴注入用的 DB session。"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
