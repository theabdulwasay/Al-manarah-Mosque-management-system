from django.utils import timezone
from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from members.models import Member
from finance.models import Donation, Expense
from events.models import Event
from announcements.models import Announcement
from prayer.models import PrayerTiming


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    today = timezone.now().date()
    month_start = today.replace(day=1)

    total_members = Member.objects.filter(status='active').count()
    total_donations_month = Donation.objects.filter(date__gte=month_start).aggregate(t=Sum('amount'))['t'] or 0
    total_expenses_month = Expense.objects.filter(date__gte=month_start).aggregate(t=Sum('amount'))['t'] or 0
    total_donations_all = Donation.objects.aggregate(t=Sum('amount'))['t'] or 0
    total_expenses_all = Expense.objects.aggregate(t=Sum('amount'))['t'] or 0
    upcoming_events = Event.objects.filter(start_datetime__gte=timezone.now(), is_published=True).count()
    active_announcements = Announcement.objects.filter(is_active=True).count()

    today_prayer = PrayerTiming.objects.filter(date=today).first()

    # last 6 months donation/expense trend
    trend = []
    for i in range(5, -1, -1):
        month_date = (today.replace(day=1) - timezone.timedelta(days=1)).replace(day=1) if i == 0 else None
    # simpler: compute per month by iterating
    import calendar
    months = []
    y, m = today.year, today.month
    for i in range(5, -1, -1):
        mm = m - i
        yy = y
        while mm <= 0:
            mm += 12
            yy -= 1
        months.append((yy, mm))
    monthly_trend = []
    for (yy, mm) in months:
        start = today.replace(year=yy, month=mm, day=1)
        last_day = calendar.monthrange(yy, mm)[1]
        end = today.replace(year=yy, month=mm, day=last_day)
        d = Donation.objects.filter(date__gte=start, date__lte=end).aggregate(t=Sum('amount'))['t'] or 0
        e = Expense.objects.filter(date__gte=start, date__lte=end).aggregate(t=Sum('amount'))['t'] or 0
        monthly_trend.append({
            'month': start.strftime('%b %Y'),
            'donations': float(d),
            'expenses': float(e),
        })

    return Response({
        'total_members': total_members,
        'balance': float(total_donations_all) - float(total_expenses_all),
        'donations_month': float(total_donations_month),
        'expenses_month': float(total_expenses_month),
        'upcoming_events': upcoming_events,
        'active_announcements': active_announcements,
        'today_prayer': {
            'fajr': today_prayer.fajr_iqamah.strftime('%H:%M') if today_prayer else None,
            'dhuhr': today_prayer.dhuhr_iqamah.strftime('%H:%M') if today_prayer else None,
            'asr': today_prayer.asr_iqamah.strftime('%H:%M') if today_prayer else None,
            'maghrib': today_prayer.maghrib_iqamah.strftime('%H:%M') if today_prayer else None,
            'isha': today_prayer.isha_iqamah.strftime('%H:%M') if today_prayer else None,
        } if today_prayer else None,
        'monthly_trend': monthly_trend,
    })
