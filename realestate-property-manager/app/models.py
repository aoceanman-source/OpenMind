"""資料庫模型 — 整個系統的核心。

把分散的「一物件一 Excel」拆成兩張關聯式資料表：

    Property（物件主檔，一棟一筆）
        └─< Floor（樓層 / 租約明細，一層或一個區劃一筆）= レントロール

兩張表用 property_id 綁定。月租金在樓層層級輸入，物件層級的年收、
利回り（投資報酬率）全部由 metrics.py 即時算出 —— 一處輸入、處處同步，
這正是它取代 Excel 的關鍵。
"""
from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class Property(Base):
    """物件主檔（一棟商辦一筆）。"""

    __tablename__ = "properties"

    id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, index=True, nullable=False)  # 物件編號 e.g. TKY-001
    name = Column(String, nullable=False)                           # 物件名稱

    # 位置
    prefecture = Column(String, index=True)                         # 都道府県
    city = Column(String)                                           # 市區町村
    address = Column(String)                                        # 詳細地址
    nearest_station = Column(String)                                # 最寄り駅
    walk_minutes = Column(Integer)                                  # 徒步分鐘

    # 建物概要
    structure = Column(String)                                      # 構造 RC / SRC / S
    floors_above = Column(Integer)                                  # 地上樓層數
    floors_below = Column(Integer)                                  # 地下樓層數
    built_year = Column(Integer)                                    # 築年
    built_month = Column(Integer)                                   # 築月
    land_area_sqm = Column(Float)                                   # 土地面積 ㎡
    gross_floor_area_sqm = Column(Float)                            # 延床面積 ㎡
    ownership_type = Column(String)                                 # 所有権 / 借地権
    earthquake_standard = Column(String)                            # 新耐震 / 旧耐震

    # 金額（以日圓為主，台幣由匯率換算）
    price_jpy = Column(Float, nullable=False)                       # 販售價格 日圓
    exchange_rate = Column(Float, default=0.21)                     # 匯率：1 JPY = ? TWD
    property_tax_jpy = Column(Float, default=0)                     # 固定資產稅 / 年
    management_fee_jpy = Column(Float, default=0)                   # 管理修繕費 / 年

    # 銷售管理
    status = Column(String, default="在庫", index=True)            # 在庫 / 商談中 / 成約
    assigned_sales = Column(String, index=True)                    # 負責業務
    note = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    floors = relationship(
        "Floor",
        back_populates="property",
        cascade="all, delete-orphan",
        order_by="Floor.sort_order",
    )


class Floor(Base):
    """樓層 / 租約明細（レントロール，一層或一個區劃一筆）。"""

    __tablename__ = "floors"

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), index=True)
    sort_order = Column(Integer, default=0)            # 排序（地下為負、地上為正）

    floor_label = Column(String)                       # 樓層 B1 / 1F / 2F …
    unit = Column(String)                              # 區劃（同層多戶時）
    area_sqm = Column(Float, default=0)                # 面積 ㎡
    status = Column(String, default="空室")            # 賃貸中 / 空室

    tenant_name = Column(String)                       # 租客名稱
    tenant_industry = Column(String)                   # 業種
    monthly_rent_jpy = Column(Float, default=0)        # 月租金
    monthly_common_fee_jpy = Column(Float, default=0)  # 共益費
    assumed_monthly_rent_jpy = Column(Float, default=0)  # 空室時的想定月租（用於滿室想定利回り）
    deposit_jpy = Column(Float, default=0)             # 押金 / 保証金
    lease_start = Column(String)                       # 契約開始 YYYY-MM
    lease_end = Column(String)                         # 契約結束 YYYY-MM
    note = Column(String)

    property = relationship("Property", back_populates="floors")
