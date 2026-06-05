"""投資指標計算 —— 商辦一棟投資的核心數字。

這些數字「不存進資料庫」，而是每次從樓層租約即時算出，
所以業務只要改租金，利回り、年收、空室率全部跟著變，永遠不會對不上。
"""

SQM_PER_TSUBO = 3.305785  # 1 坪 = 3.305785 ㎡


def sqm_to_tsubo(sqm):
    return round((sqm or 0) / SQM_PER_TSUBO, 2)


def _floor_full_monthly(f):
    """滿室想定下，該層的月收（含共益費）。空室則用想定租金。"""
    if f.status == "賃貸中":
        return (f.monthly_rent_jpy or 0) + (f.monthly_common_fee_jpy or 0)
    return f.assumed_monthly_rent_jpy or 0


def _floor_current_monthly(f):
    """現況月收：只計算正在出租中的樓層。"""
    if f.status == "賃貸中":
        return (f.monthly_rent_jpy or 0) + (f.monthly_common_fee_jpy or 0)
    return 0


def compute_metrics(prop):
    """回傳一個物件的所有投資指標（dict）。"""
    floors = prop.floors or []
    price = prop.price_jpy or 0
    rate = prop.exchange_rate or 0.21

    total_area = sum((f.area_sqm or 0) for f in floors)
    occupied_area = sum((f.area_sqm or 0) for f in floors if f.status == "賃貸中")

    current_monthly = sum(_floor_current_monthly(f) for f in floors)
    full_monthly = sum(_floor_full_monthly(f) for f in floors)
    current_annual = current_monthly * 12
    full_annual = full_monthly * 12

    def yield_pct(annual):
        return round(annual / price * 100, 2) if price else 0

    occupancy = round(occupied_area / total_area * 100, 1) if total_area else 0

    return {
        "floor_count": len(floors),
        "total_area_sqm": round(total_area, 2),
        "total_area_tsubo": sqm_to_tsubo(total_area),
        "occupied_area_sqm": round(occupied_area, 2),
        "occupancy_rate": occupancy,                 # 入居率 %
        "vacancy_rate": round(100 - occupancy, 1),   # 空室率 %
        "current_monthly_income_jpy": current_monthly,
        "current_annual_income_jpy": current_annual,
        "full_monthly_income_jpy": full_monthly,
        "full_annual_income_jpy": full_annual,
        "gross_yield": yield_pct(full_annual),       # 表面利回り（滿室想定）
        "current_yield": yield_pct(current_annual),  # 現況利回り
        "price_jpy": price,
        "price_twd": round(price * rate),
        "exchange_rate": rate,
    }
