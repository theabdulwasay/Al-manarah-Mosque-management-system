from rest_framework import viewsets
from .models import Announcement
from .serializers import AnnouncementSerializer
from accounts.permissions import IsAdminOrSuperAdmin


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filterset_fields = ['priority', 'is_active', 'is_pinned']
    search_fields = ['title', 'content']
