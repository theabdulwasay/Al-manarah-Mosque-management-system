from rest_framework import serializers
from .models import PrayerTiming


class PrayerTimingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrayerTiming
        fields = '__all__'
