from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PrayerTiming
from .serializers import PrayerTimingSerializer
from accounts.permissions import IsAdminOrSuperAdmin


class PrayerTimingViewSet(viewsets.ModelViewSet):
    queryset = PrayerTiming.objects.all()
    serializer_class = PrayerTimingSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filterset_fields = ['date']

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def today(self, request):
        today = timezone.now().date()
        timing = PrayerTiming.objects.filter(date=today).first()
        if not timing:
            timing = PrayerTiming.objects.filter(date__lte=today).order_by('-date').first()
        if not timing:
            return Response(None)
        return Response(PrayerTimingSerializer(timing).data)
