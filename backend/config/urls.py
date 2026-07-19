from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from dashboard.views import dashboard_stats

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('members.urls')),
    path('api/', include('finance.urls')),
    path('api/', include('events.urls')),
    path('api/', include('announcements.urls')),
    path('api/', include('prayer.urls')),
    path('api/dashboard/stats/', dashboard_stats, name='dashboard-stats'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
