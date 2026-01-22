AVERAGE_SPEED_MPH = 55
MAX_DRIVING_HOURS_PER_DAY = 11
BREAK_AFTER_HOURS = 8
BREAK_DURATION = 0.5  # 30 minutes
PICKUP_TIME = 1
DROPOFF_TIME = 1

DAY_START_WORK = 6          # 06:00
REQUIRED_REST_HOURS = 10    # Sleeper requirement


def calculate_daily_logs(distance_miles, cycle_used_hours, use_sleeper=False):
    total_driving_hours = distance_miles / AVERAGE_SPEED_MPH
    remaining_driving = total_driving_hours

    is_multi_day_trip = total_driving_hours > MAX_DRIVING_HOURS_PER_DAY

    days = []
    day_number = 1

    # Carry-over sleeper hours across midnight
    carryover_sleeper_hours = 0

    while remaining_driving > 0:
        segments = []
        current_time = 0
        sleeper_used_today = 0

        # ==========================
        # 00:00 → 06:00 MORNING REST
        # ==========================

        # Day 1 rule: ALWAYS Off Duty
        if day_number == 1:
            segments.append({
                "type": "off_duty",
                "start": 0,
                "end": DAY_START_WORK
            })

        # Day 2+ sleeper carryover
        elif use_sleeper and is_multi_day_trip and carryover_sleeper_hours > 0:
            sleeper_hours = min(DAY_START_WORK, carryover_sleeper_hours)

            segments.append({
                "type": "sleeper",
                "start": 0,
                "end": sleeper_hours
            })

            sleeper_used_today += sleeper_hours
            carryover_sleeper_hours -= sleeper_hours

            if sleeper_hours < DAY_START_WORK:
                segments.append({
                    "type": "off_duty",
                    "start": sleeper_hours,
                    "end": DAY_START_WORK
                })
        else:
            segments.append({
                "type": "off_duty",
                "start": 0,
                "end": DAY_START_WORK
            })

        current_time = DAY_START_WORK

        # ==========================
        # PICKUP (DAY 1 ONLY)
        # ==========================
        if day_number == 1:
            segments.append({
                "type": "on_duty",
                "start": current_time,
                "end": current_time + PICKUP_TIME
            })
            current_time += PICKUP_TIME

        # ==========================
        # DRIVING BLOCK
        # ==========================
        driving_today = min(MAX_DRIVING_HOURS_PER_DAY, remaining_driving)

        if driving_today > BREAK_AFTER_HOURS:
            segments.append({
                "type": "driving",
                "start": current_time,
                "end": current_time + BREAK_AFTER_HOURS
            })
            current_time += BREAK_AFTER_HOURS

            segments.append({
                "type": "off_duty",
                "start": current_time,
                "end": current_time + BREAK_DURATION
            })
            current_time += BREAK_DURATION

            remaining_drive = driving_today - BREAK_AFTER_HOURS
            segments.append({
                "type": "driving",
                "start": current_time,
                "end": current_time + remaining_drive
            })
            current_time += remaining_drive
        else:
            segments.append({
                "type": "driving",
                "start": current_time,
                "end": current_time + driving_today
            })
            current_time += driving_today

        # ==========================
        # DROPOFF (LAST DAY ONLY)
        # ==========================
        if remaining_driving <= MAX_DRIVING_HOURS_PER_DAY:
            segments.append({
                "type": "on_duty",
                "start": current_time,
                "end": current_time + DROPOFF_TIME
            })
            current_time += DROPOFF_TIME

        # ==========================
        # EVENING REST (SLEEPER LOGIC)
        # ==========================
        rest_remaining = 24 - current_time

        if use_sleeper and is_multi_day_trip:
            sleeper_available = REQUIRED_REST_HOURS - sleeper_used_today

            sleeper_hours = min(rest_remaining, sleeper_available)

            if sleeper_hours > 0:
                segments.append({
                    "type": "sleeper",
                    "start": current_time,
                    "end": current_time + sleeper_hours
                })
                sleeper_used_today += sleeper_hours
                carryover_sleeper_hours += sleeper_hours
                current_time += sleeper_hours

            if current_time < 24:
                segments.append({
                    "type": "off_duty",
                    "start": current_time,
                    "end": 24
                })
        else:
            segments.append({
                "type": "off_duty",
                "start": current_time,
                "end": 24
            })

        days.append({
            "day": day_number,
            "segments": segments
        })

        remaining_driving -= driving_today
        day_number += 1

    return {
        "distance_miles": round(distance_miles, 2),
        "total_driving_hours": round(total_driving_hours, 2),
        "logs": days
    }
