from rest_framework import serializers
from .models import Member, VolunteerCommittee


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


class VolunteerCommitteeSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.full_name', read_only=True)

    class Meta:
        model = VolunteerCommittee
        fields = '__all__'
