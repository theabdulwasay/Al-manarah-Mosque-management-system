from django.contrib import admin
from .models import Member, VolunteerCommittee

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'membership_type', 'status', 'date_joined')
    list_filter = ('membership_type', 'status')
    search_fields = ('full_name', 'phone', 'cnic')

@admin.register(VolunteerCommittee)
class VolunteerCommitteeAdmin(admin.ModelAdmin):
    list_display = ('member', 'role', 'term_start', 'term_end', 'is_active')
