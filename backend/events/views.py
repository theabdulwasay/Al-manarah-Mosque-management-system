from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Event
from .serializers import EventSerializer
from accounts.permissions import IsAdminOrSuperAdmin


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filterset_fields = ['event_type', 'is_published']
    search_fields = ['title', 'speaker']
    ordering_fields = ['start_datetime']

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def upcoming(self, request):
        events = Event.objects.filter(
            start_datetime__gte=timezone.now(), is_published=True
        ).order_by('start_datetime')[:10]
        return Response(EventSerializer(events, many=True).data)
