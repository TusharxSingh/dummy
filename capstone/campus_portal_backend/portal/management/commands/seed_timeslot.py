# portal/management/commands/seed_timeslots.py

from django.core.management.base import BaseCommand
from portal.models import Day, TimeSlot
from datetime import time

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

        # List of start times, each assumed to be 50 mins long
        start_times = [
            time(8, 0),
            time(8, 50),
            time(9, 40),
            time(10, 30),
            time(11, 20),
            time(12, 10),
            time(13, 0),
            time(13, 50),
            time(14, 40),
            time(15, 30),
            time(16, 20),
            time(17, 10),
            time(18, 0),
            time(18, 50),
        ]

        for day_name in days:
            day, _ = Day.objects.get_or_create(name=day_name)

            for start in start_times:
                end_hour = start.hour
                end_minute = start.minute + 50
                if end_minute >= 60:
                    end_hour += 1
                    end_minute -= 60
                end_time = time(end_hour, end_minute)

                TimeSlot.objects.get_or_create(day=day, start_time=start, end_time=end_time)

        self.stdout.write(self.style.SUCCESS("All days and time slots seeded successfully."))
