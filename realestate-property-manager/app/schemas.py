"""Pydantic 結構 —— 用於驗證 API 輸入（新增 / 修改物件）。

API 回傳的物件會額外帶上即時計算的 metrics，
那部分在 main.py 直接組 dict，不在這裡定義。
"""
from typing import List, Optional

from pydantic import BaseModel


class FloorIn(BaseModel):
    sort_order: int = 0
    floor_label: Optional[str] = None
    unit: Optional[str] = None
    area_sqm: float = 0
    status: str = "空室"
    tenant_name: Optional[str] = None
    tenant_industry: Optional[str] = None
    monthly_rent_jpy: float = 0
    monthly_common_fee_jpy: float = 0
    assumed_monthly_rent_jpy: float = 0
    deposit_jpy: float = 0
    lease_start: Optional[str] = None
    lease_end: Optional[str] = None
    note: Optional[str] = None


class PropertyIn(BaseModel):
    code: str
    name: str
    prefecture: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    nearest_station: Optional[str] = None
    walk_minutes: Optional[int] = None
    structure: Optional[str] = None
    floors_above: Optional[int] = None
    floors_below: Optional[int] = None
    built_year: Optional[int] = None
    built_month: Optional[int] = None
    land_area_sqm: Optional[float] = None
    gross_floor_area_sqm: Optional[float] = None
    ownership_type: Optional[str] = None
    earthquake_standard: Optional[str] = None
    price_jpy: float
    exchange_rate: float = 0.21
    property_tax_jpy: float = 0
    management_fee_jpy: float = 0
    status: str = "在庫"
    assigned_sales: Optional[str] = None
    note: Optional[str] = None
    floors: List[FloorIn] = []
