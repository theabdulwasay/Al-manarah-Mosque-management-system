from django.contrib import admin
from .models import PrayerTiming

@admin.register(PrayerTiming)
class PrayerTimingAdmin(admin.ModelAdmin):
    list_display = ('date', 'fajr_iqamah', 'dhuhr_iqamah', 'asr_iqamah', 'maghrib_iqamah', 'isha_iqamah')
