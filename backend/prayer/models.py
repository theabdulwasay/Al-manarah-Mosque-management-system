from django.db import models


class PrayerTiming(models.Model):
    date = models.DateField(unique=True)
    fajr_adhan = models.TimeField()
    fajr_iqamah = models.TimeField()
    dhuhr_adhan = models.TimeField()
    dhuhr_iqamah = models.TimeField()
    asr_adhan = models.TimeField()
    asr_iqamah = models.TimeField()
    maghrib_adhan = models.TimeField()
    maghrib_iqamah = models.TimeField()
    isha_adhan = models.TimeField()
    isha_iqamah = models.TimeField()
    jummah_khutbah = models.TimeField(null=True, blank=True)
    jummah_iqamah = models.TimeField(null=True, blank=True)
    sunrise = models.TimeField(null=True, blank=True)
    notes = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Prayer timing - {self.date}"
