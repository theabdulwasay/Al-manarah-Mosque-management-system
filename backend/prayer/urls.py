from rest_framework.routers import DefaultRouter
from .views import PrayerTimingViewSet

router = DefaultRouter()
router.register('prayer-timings', PrayerTimingViewSet, basename='prayer-timing')

urlpatterns = router.urls
