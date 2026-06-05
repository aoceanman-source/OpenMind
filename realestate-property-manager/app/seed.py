"""灌入範例資料（4 棟日本商辦 + 逐層租約）。

    python -m app.seed

會「重建」資料表並寫入示範資料，方便隨時把 demo 還原成乾淨狀態。
"""
from .database import Base, SessionLocal, engine
from .models import Floor, Property

TSUBO = 3.305785  # 坪 → ㎡


def f(order, label, tsubo, status, tenant=None, industry=None, rent=0, common=0,
      assumed=0, deposit=0, start=None, end=None):
    """快速建立一筆樓層資料（面積以坪輸入，存成 ㎡）。"""
    return Floor(
        sort_order=order, floor_label=label, area_sqm=round(tsubo * TSUBO, 2),
        status=status, tenant_name=tenant, tenant_industry=industry,
        monthly_rent_jpy=rent, monthly_common_fee_jpy=common,
        assumed_monthly_rent_jpy=assumed or rent, deposit_jpy=deposit,
        lease_start=start, lease_end=end,
    )


def build():
    properties = [
        Property(
            code="TKY-001", name="渋谷桜丘ビル",
            prefecture="東京都", city="渋谷区", address="渋谷区桜丘町 12-8",
            nearest_station="渋谷駅", walk_minutes=5,
            structure="SRC", floors_above=8, floors_below=1,
            built_year=2008, built_month=3,
            land_area_sqm=412.5, gross_floor_area_sqm=2680.0,
            ownership_type="所有権", earthquake_standard="新耐震",
            price_jpy=2_480_000_000, exchange_rate=0.21,
            property_tax_jpy=9_800_000, management_fee_jpy=6_200_000,
            status="在庫", assigned_sales="林志明",
            note="渋谷駅徒步圏、稀少な一棟商辦。一階為路面店舗。",
            floors=[
                f(-1, "B1", 48, "賃貸中", "和食ダイニング 蔵", "餐飲", 720_000, 72_000, deposit=4_320_000, start="2022-04", end="2027-03"),
                f(1, "1F", 42, "賃貸中", "スターコーヒー渋谷店", "餐飲", 1_180_000, 118_000, deposit=7_080_000, start="2021-06", end="2026-05"),
                f(2, "2F", 55, "賃貸中", "アイリス美容クリニック", "醫療", 1_050_000, 105_000, deposit=6_300_000, start="2023-01", end="2028-12"),
                f(3, "3F", 55, "賃貸中", "デジタルワークス株式会社", "IT", 1_000_000, 100_000, deposit=6_000_000, start="2020-09", end="2026-08"),
                f(4, "4F", 55, "賃貸中", "山田会計事務所", "士業", 980_000, 98_000, deposit=5_880_000, start="2019-04", end="2027-03"),
                f(5, "5F", 55, "賃貸中", "クリエイティブ広告社", "廣告", 980_000, 98_000, deposit=5_880_000, start="2022-10", end="2026-09"),
                f(6, "6F", 55, "空室", assumed=980_000),
                f(7, "7F", 55, "賃貸中", "グローバル人材紹介", "人材", 1_000_000, 100_000, deposit=6_000_000, start="2023-07", end="2028-06"),
                f(8, "8F", 50, "賃貸中", "プレミアムオフィス（一棟借）", "辦公", 950_000, 95_000, deposit=5_700_000, start="2021-11", end="2026-10"),
            ],
        ),
        Property(
            code="OSK-014", name="本町セントラルビル",
            prefecture="大阪府", city="大阪市中央区", address="中央区本町 3-5-7",
            nearest_station="本町駅", walk_minutes=3,
            structure="RC", floors_above=9, floors_below=0,
            built_year=2015, built_month=7,
            land_area_sqm=305.0, gross_floor_area_sqm=2210.0,
            ownership_type="所有権", earthquake_standard="新耐震",
            price_jpy=1_280_000_000, exchange_rate=0.21,
            property_tax_jpy=5_400_000, management_fee_jpy=3_600_000,
            status="在庫", assigned_sales="陳怡君",
            note="築浅、本町駅至近のオフィスビル。満室稼働中。",
            floors=[
                f(1, "1F", 40, "賃貸中", "三井住友信用金庫 本町支店", "金融", 720_000, 70_000, deposit=4_320_000, start="2020-01", end="2029-12"),
                f(2, "2F", 38, "賃貸中", "メディカル本町クリニック", "醫療", 560_000, 56_000, deposit=3_360_000, start="2021-04", end="2027-03"),
                f(3, "3F", 38, "賃貸中", "西日本社会保険労務士法人", "士業", 520_000, 52_000, deposit=3_120_000, start="2019-08", end="2026-07"),
                f(4, "4F", 38, "賃貸中", "テックブリッジ株式会社", "IT", 530_000, 53_000, deposit=3_180_000, start="2022-02", end="2027-01"),
                f(5, "5F", 38, "賃貸中", "関西不動産販売", "不動産", 520_000, 52_000, deposit=3_120_000, start="2020-06", end="2026-05"),
                f(6, "6F", 38, "賃貸中", "あおぞらコンサルティング", "顧問", 520_000, 52_000, deposit=3_120_000, start="2023-03", end="2028-02"),
                f(7, "7F", 38, "賃貸中", "ナニワ商事株式会社", "貿易", 520_000, 52_000, deposit=3_120_000, start="2021-09", end="2026-08"),
                f(8, "8F", 38, "賃貸中", "デザインスタジオ凪", "設計", 510_000, 51_000, deposit=3_060_000, start="2022-12", end="2027-11"),
                f(9, "9F", 36, "賃貸中", "本町法律事務所", "士業", 540_000, 54_000, deposit=3_240_000, start="2020-10", end="2026-09"),
            ],
        ),
        Property(
            code="FUK-007", name="博多駅前オフィスタワー",
            prefecture="福岡県", city="福岡市博多区", address="博多区博多駅前 2-1-1",
            nearest_station="博多駅", walk_minutes=4,
            structure="S", floors_above=7, floors_below=0,
            built_year=2019, built_month=11,
            land_area_sqm=268.0, gross_floor_area_sqm=1560.0,
            ownership_type="所有権", earthquake_standard="新耐震",
            price_jpy=880_000_000, exchange_rate=0.21,
            property_tax_jpy=3_200_000, management_fee_jpy=2_400_000,
            status="在庫", assigned_sales="林志明",
            note="高利回り。一部空室あり、リーシング強化で上昇余地。",
            floors=[
                f(1, "1F", 35, "賃貸中", "博多ラーメン一番", "餐飲", 540_000, 54_000, deposit=3_240_000, start="2020-03", end="2026-02"),
                f(2, "2F", 32, "賃貸中", "九州ITソリューションズ", "IT", 420_000, 42_000, deposit=2_520_000, start="2021-05", end="2026-04"),
                f(3, "3F", 32, "空室", assumed=420_000),
                f(4, "4F", 32, "賃貸中", "博多税理士法人", "士業", 410_000, 41_000, deposit=2_460_000, start="2022-07", end="2027-06"),
                f(5, "5F", 32, "賃貸中", "リクルートエージェント福岡", "人材", 420_000, 42_000, deposit=2_520_000, start="2020-09", end="2026-08"),
                f(6, "6F", 32, "空室", assumed=420_000),
                f(7, "7F", 30, "賃貸中", "スカイビューラウンジ", "餐飲", 460_000, 46_000, deposit=2_760_000, start="2021-12", end="2026-11"),
            ],
        ),
        Property(
            code="NGY-022", name="栄ガーデンビル",
            prefecture="愛知県", city="名古屋市中区", address="中区栄 4-2-9",
            nearest_station="栄駅", walk_minutes=6,
            structure="SRC", floors_above=10, floors_below=2,
            built_year=2005, built_month=5,
            land_area_sqm=520.0, gross_floor_area_sqm=3850.0,
            ownership_type="所有権", earthquake_standard="新耐震",
            price_jpy=1_650_000_000, exchange_rate=0.21,
            property_tax_jpy=7_100_000, management_fee_jpy=5_000_000,
            status="商談中", assigned_sales="陳怡君",
            note="栄エリアの大型一棟。地下駐車場 18 台付。現在買付検討中。",
            floors=[
                f(-2, "B2", 60, "賃貸中", "タイムズ駐車場", "駐車場", 480_000, 0, deposit=1_440_000, start="2018-01", end="2028-12"),
                f(-1, "B1", 58, "賃貸中", "ライブハウス SAKAE SOUND", "娛樂", 620_000, 62_000, deposit=3_720_000, start="2020-04", end="2027-03"),
                f(1, "1F", 50, "賃貸中", "ブランドブティック栄", "零售", 1_050_000, 105_000, deposit=6_300_000, start="2021-03", end="2026-02"),
                f(2, "2F", 60, "賃貸中", "中部メディカルモール", "醫療", 880_000, 88_000, deposit=5_280_000, start="2019-07", end="2027-06"),
                f(3, "3F", 60, "賃貸中", "東海ビジネス専門学校", "教育", 820_000, 82_000, deposit=4_920_000, start="2020-04", end="2028-03"),
                f(4, "4F", 60, "賃貸中", "名古屋システム開発", "IT", 800_000, 80_000, deposit=4_800_000, start="2022-01", end="2026-12"),
                f(5, "5F", 60, "賃貸中", "中京監査法人", "士業", 800_000, 80_000, deposit=4_800_000, start="2021-06", end="2026-05"),
                f(6, "6F", 60, "空室", assumed=800_000),
                f(7, "7F", 60, "賃貸中", "グローバル貿易株式会社", "貿易", 800_000, 80_000, deposit=4_800_000, start="2020-11", end="2026-10"),
                f(8, "8F", 58, "賃貸中", "クラウドワークス名古屋", "IT", 790_000, 79_000, deposit=4_740_000, start="2023-02", end="2028-01"),
                f(9, "9F", 58, "賃貸中", "栄デンタルクリニック", "醫療", 800_000, 80_000, deposit=4_800_000, start="2021-09", end="2027-08"),
                f(10, "10F", 50, "賃貸中", "スカイレストラン天空", "餐飲", 760_000, 76_000, deposit=4_560_000, start="2020-05", end="2026-04"),
            ],
        ),
    ]
    return properties


def main():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        props = build()
        db.add_all(props)
        db.commit()
        print(f"✓ 已寫入 {len(props)} 棟物件：")
        for p in props:
            print(f"   - {p.code}  {p.name}（{len(p.floors)} 層）")
    finally:
        db.close()


if __name__ == "__main__":
    main()
