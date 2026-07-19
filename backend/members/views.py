from rest_framework import viewsets
from .models import Member, VolunteerCommittee
from .serializers import MemberSerializer, VolunteerCommitteeSerializer
from accounts.permissions import IsAdminOrSuperAdmin


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filterset_fields = ['membership_type', 'status']
    search_fields = ['full_name', 'phone', 'cnic', 'email']
    ordering_fields = ['full_name', 'date_joined']


class VolunteerCommitteeViewSet(viewsets.ModelViewSet):
    queryset = VolunteerCommittee.objects.select_related('member').all()
    serializer_class = VolunteerCommitteeSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filterset_fields = ['role', 'is_active']
