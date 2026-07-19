from django.db.models import Sum
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Donation, DonationCategory, Expense, ExpenseCategory
from .serializers import (DonationSerializer, DonationCategorySerializer,
                           ExpenseSerializer, ExpenseCategorySerializer)
from accounts.permissions import IsTreasurerOrAdmin


class DonationCategoryViewSet(viewsets.ModelViewSet):
    queryset = DonationCategory.objects.all()
    serializer_class = DonationCategorySerializer
    permission_classes = [IsTreasurerOrAdmin]


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.select_related('category', 'donor').all()
    serializer_class = DonationSerializer
    permission_classes = [IsTreasurerOrAdmin]
    filterset_fields = ['category', 'payment_method', 'is_recurring']
    search_fields = ['donor_name', 'receipt_number']
    ordering_fields = ['date', 'amount']


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsTreasurerOrAdmin]


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.select_related('category').all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsTreasurerOrAdmin]
    filterset_fields = ['category']
    search_fields = ['title', 'paid_to']
    ordering_fields = ['date', 'amount']


class FinanceSummaryView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        today = timezone.now().date()
        month_start = today.replace(day=1)
        year_start = today.replace(month=1, day=1)

        total_donations = Donation.objects.aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0
        month_donations = Donation.objects.filter(date__gte=month_start).aggregate(total=Sum('amount'))['total'] or 0
        month_expenses = Expense.objects.filter(date__gte=month_start).aggregate(total=Sum('amount'))['total'] or 0
        year_donations = Donation.objects.filter(date__gte=year_start).aggregate(total=Sum('amount'))['total'] or 0
        year_expenses = Expense.objects.filter(date__gte=year_start).aggregate(total=Sum('amount'))['total'] or 0

        by_category = list(
            Donation.objects.values('category__name').annotate(total=Sum('amount')).order_by('-total')
        )
        expense_by_category = list(
            Expense.objects.values('category__name').annotate(total=Sum('amount')).order_by('-total')
        )

        return Response({
            'balance': float(total_donations) - float(total_expenses),
            'total_donations': total_donations,
            'total_expenses': total_expenses,
            'month_donations': month_donations,
            'month_expenses': month_expenses,
            'year_donations': year_donations,
            'year_expenses': year_expenses,
            'donations_by_category': by_category,
            'expenses_by_category': expense_by_category,
        })
