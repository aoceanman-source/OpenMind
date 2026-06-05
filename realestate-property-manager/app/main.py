"""FastAPI 主程式 —— API、報表下載、業務查詢後台。

啟動：
    uvicorn app.main:app --reload
然後開 http://127.0.0.1:8000
"""
from datetime import date
from pathlib import Path
from urllib.parse import quote

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from starlette.requests import Request

from . import models, schemas
from .database import Base, engine, get_db
from .metrics import compute_metrics, sqm_to_tsubo
from .report import build_report_workbook

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(title="日本商辦物件管理系統")
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# 啟動時確保資料表存在（首次跑請另外執行 python -m app.seed 灌入範例資料）
Base.metadata.create_all(bind=engine)


# ── 序列化 ──
def floor_dict(f):
    d = {c.name: getattr(f, c.name) for c in f.__table__.columns}
    d["area_tsubo"] = sqm_to_tsubo(f.area_sqm)
    return d


def property_dict(p, detail=False):
    d = {c.name: getattr(p, c.name) for c in p.__table__.columns}
    d["metrics"] = compute_metrics(p)
    if detail:
        d["floors"] = [floor_dict(f) for f in p.floors]
    return d


def _all_properties(db):
    return db.scalars(
        select(models.Property).options(selectinload(models.Property.floors))
    ).all()


# ── 頁面 ──
@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request):
    return templates.TemplateResponse(request, "index.html")


# ── API ──
@app.get("/api/stats")
def stats(db: Session = Depends(get_db)):
    props = _all_properties(db)
    yields = [compute_metrics(p)["gross_yield"] for p in props if p.price_jpy]
    by_status = {}
    for p in props:
        by_status[p.status] = by_status.get(p.status, 0) + 1
    return {
        "property_count": len(props),
        "total_value_jpy": sum(p.price_jpy or 0 for p in props),
        "total_value_twd": round(sum((p.price_jpy or 0) * (p.exchange_rate or 0.21) for p in props)),
        "avg_gross_yield": round(sum(yields) / len(yields), 2) if yields else 0,
        "by_status": by_status,
        "prefectures": sorted({p.prefecture for p in props if p.prefecture}),
        "sales": sorted({p.assigned_sales for p in props if p.assigned_sales}),
    }


@app.get("/api/properties")
def list_properties(
    q: str = "",
    prefecture: str = "",
    status: str = "",
    sales: str = "",
    min_yield: float = 0,
    max_price_jpy: float = 0,
    db: Session = Depends(get_db),
):
    out = []
    for p in _all_properties(db):
        m = compute_metrics(p)
        haystack = f"{p.code} {p.name} {p.address or ''} {p.nearest_station or ''}".lower()
        if q and q.lower() not in haystack:
            continue
        if prefecture and p.prefecture != prefecture:
            continue
        if status and p.status != status:
            continue
        if sales and p.assigned_sales != sales:
            continue
        if min_yield and m["gross_yield"] < min_yield:
            continue
        if max_price_jpy and (p.price_jpy or 0) > max_price_jpy:
            continue
        out.append(property_dict(p))
    out.sort(key=lambda d: d["metrics"]["gross_yield"], reverse=True)
    return out


@app.get("/api/properties/{pid}")
def get_property(pid: int, db: Session = Depends(get_db)):
    p = db.get(models.Property, pid)
    if not p:
        raise HTTPException(404, "物件不存在")
    return property_dict(p, detail=True)


@app.post("/api/properties", status_code=201)
def create_property(payload: schemas.PropertyIn, db: Session = Depends(get_db)):
    if db.scalar(select(models.Property).where(models.Property.code == payload.code)):
        raise HTTPException(400, f"物件編號 {payload.code} 已存在")
    data = payload.model_dump()
    floors = data.pop("floors", [])
    p = models.Property(**data)
    for fd in floors:
        p.floors.append(models.Floor(**fd))
    db.add(p)
    db.commit()
    db.refresh(p)
    return property_dict(p, detail=True)


@app.put("/api/properties/{pid}")
def update_property(pid: int, payload: schemas.PropertyIn, db: Session = Depends(get_db)):
    p = db.get(models.Property, pid)
    if not p:
        raise HTTPException(404, "物件不存在")
    data = payload.model_dump()
    floors = data.pop("floors", [])
    for k, v in data.items():
        setattr(p, k, v)
    p.floors.clear()
    for fd in floors:
        p.floors.append(models.Floor(**fd))
    db.commit()
    db.refresh(p)
    return property_dict(p, detail=True)


@app.delete("/api/properties/{pid}", status_code=204)
def delete_property(pid: int, db: Session = Depends(get_db)):
    p = db.get(models.Property, pid)
    if not p:
        raise HTTPException(404, "物件不存在")
    db.delete(p)
    db.commit()


# ── 固定報表：物件概要書 ──
@app.get("/property/{pid}/report.xlsx")
def report_xlsx(pid: int, db: Session = Depends(get_db)):
    p = db.get(models.Property, pid)
    if not p:
        raise HTTPException(404, "物件不存在")
    buf = build_report_workbook(p)
    filename = quote(f"物件概要書_{p.code}_{p.name}.xlsx")
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename*=UTF-8''{filename}"},
    )


@app.get("/property/{pid}/report", response_class=HTMLResponse)
def report_html(pid: int, request: Request, db: Session = Depends(get_db)):
    p = db.get(models.Property, pid)
    if not p:
        raise HTTPException(404, "物件不存在")
    return templates.TemplateResponse(
        request,
        "report.html",
        {
            "p": p,
            "m": compute_metrics(p),
            "tsubo": sqm_to_tsubo,
            "today": date.today().strftime("%Y-%m-%d"),
        },
    )
