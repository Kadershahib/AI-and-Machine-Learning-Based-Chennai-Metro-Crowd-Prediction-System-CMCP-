"""
Synthetic Ridership Data Generator — Chennai Metro Crowd Prediction System

WHY SYNTHETIC DATA:
Chennai Metro Rail Limited (CMRL) does not publish a public real-time or
historical ridership API. For this academic project, ridership patterns are
simulated using realistic assumptions grounded in known Chennai Metro
operational facts (station tiers, peak commute hours, IT-corridor stations,
weekday/weekend variation, festival spikes). This is clearly disclosed in
the project report methodology section.

Run:
    python generate_synthetic_data.py
Output:
    raw/synthetic_ridership.csv
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

# ---- Chennai Metro stations (Blue Line + Green Line, subset for both lines) ----
STATIONS = [
    # (name, line, base_footfall_tier 1-5, is_interchange, is_it_corridor)
    ("Wimco Nagar", "Blue", 1, False, False),
    ("Washermanpet", "Blue", 2, False, False),
    ("Mannadi", "Blue", 2, False, False),
    ("High Court", "Blue", 3, False, False),
    ("Central (Chennai Central)", "Blue", 5, True, False),
    ("Government Estate", "Blue", 3, False, False),
    ("LIC", "Blue", 3, False, False),
    ("Thousand Lights", "Blue", 3, False, False),
    ("AG-DMS", "Blue", 3, False, False),
    ("Teynampet", "Blue", 3, False, False),
    ("Nandanam", "Blue", 3, False, False),
    ("Saidapet", "Blue", 4, True, False),
    ("Guindy", "Blue", 5, True, True),
    ("Alandur", "Blue", 5, True, True),
    ("Nanganallur Road", "Blue", 3, False, True),
    ("Meenambakkam", "Blue", 4, False, False),
    ("Airport", "Blue", 5, False, False),
    ("Washermanpet Depot", "Green", 1, False, False),
    ("Egmore", "Green", 5, True, False),
    ("Nehru Park", "Green", 2, False, False),
    ("Kilpauk Medical College", "Green", 3, False, False),
    ("Pachaiyappas College", "Green", 2, False, False),
    ("Shenoy Nagar", "Green", 3, False, False),
    ("Anna Nagar East", "Green", 4, False, False),
    ("Anna Nagar Tower", "Green", 4, False, False),
    ("Thirumangalam", "Green", 4, True, False),
    ("Koyambedu", "Green", 5, False, False),
    ("CMBT", "Green", 5, False, False),
    ("Arumbakkam", "Green", 3, False, False),
    ("Vadapalani", "Green", 4, False, True),
    ("Ashok Nagar", "Green", 3, False, False),
    ("Ekkattuthangal", "Green", 3, False, True),
]

WEATHER_CONDITIONS = ["Clear", "Light Rain", "Heavy Rain", "Cloudy"]
WEATHER_WEIGHTS = [0.55, 0.25, 0.08, 0.12]

# Chennai festival / high-footfall calendar days (month, day) — illustrative
FESTIVAL_DAYS = {(1, 15), (1, 14), (4, 14), (8, 15), (10, 24), (11, 12), (12, 25), (1, 1)}


def hour_multiplier(hour: int) -> float:
    """Typical Indian metro commute curve: sharp morning + evening peaks."""
    if 7 <= hour <= 10:
        return 1.6 + (0.3 if hour == 9 else 0)
    if 17 <= hour <= 20:
        return 1.8 + (0.3 if hour in (18, 19) else 0)
    if 11 <= hour <= 16:
        return 0.9
    if hour in (6, 21):
        return 0.7
    if hour in (5, 22):
        return 0.3
    return 0.1  # late night / very early


def day_multiplier(weekday: int) -> float:
    # 0=Mon ... 6=Sun
    if weekday < 5:
        return 1.0
    if weekday == 5:
        return 0.75  # Saturday
    return 0.55  # Sunday


def generate(days: int = 120) -> pd.DataFrame:
    rows = []
    start_date = datetime(2026, 1, 1)

    for d in range(days):
        current_date = start_date + timedelta(days=d)
        weekday = current_date.weekday()
        is_festival = (current_date.month, current_date.day) in FESTIVAL_DAYS
        weather = np.random.choice(WEATHER_CONDITIONS, p=WEATHER_WEIGHTS)
        weather_factor = {"Clear": 1.0, "Cloudy": 0.97, "Light Rain": 0.85, "Heavy Rain": 0.6}[weather]

        for hour in range(5, 23):  # metro operating hours
            for name, line, tier, interchange, it_corridor in STATIONS:
                base = tier * 60  # base passenger count unit

                mult = hour_multiplier(hour) * day_multiplier(weekday) * weather_factor
                if interchange:
                    mult *= 1.35
                if it_corridor and weekday < 5 and hour in list(range(7, 11)) + list(range(17, 21)):
                    mult *= 1.25
                if is_festival:
                    mult *= 1.4

                noise = np.random.normal(1.0, 0.12)
                footfall = max(0, base * mult * noise)

                # crowd_percent: normalize against station's realistic max capacity
                station_capacity = tier * 130
                crowd_percent = min(100, (footfall / station_capacity) * 100)

                if crowd_percent < 35:
                    crowd_level = "Low"
                elif crowd_percent < 70:
                    crowd_level = "Medium"
                else:
                    crowd_level = "High"

                rows.append({
                    "date": current_date.strftime("%Y-%m-%d"),
                    "weekday": weekday,
                    "is_weekend": int(weekday >= 5),
                    "hour": hour,
                    "station": name,
                    "line": line,
                    "station_tier": tier,
                    "is_interchange": int(interchange),
                    "is_it_corridor": int(it_corridor),
                    "weather": weather,
                    "is_festival": int(is_festival),
                    "footfall": round(footfall, 1),
                    "crowd_percent": round(crowd_percent, 2),
                    "crowd_level": crowd_level,
                })

    return pd.DataFrame(rows)


if __name__ == "__main__":
    df = generate(days=120)
    df.to_csv("raw/synthetic_ridership.csv", index=False)
    print(f"Generated {len(df):,} rows -> raw/synthetic_ridership.csv")
    print(df["crowd_level"].value_counts(normalize=True))
