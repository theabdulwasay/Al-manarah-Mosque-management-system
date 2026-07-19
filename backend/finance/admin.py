from django.contrib import admin
from .models import Donation, DonationCategory, Expense, ExpenseCategory

@admin.register(DonationCategory)
class DonationCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('donor_name', 'category', 'amount', 'payment_method', 'date')
    list_filter = ('category', 'payment_method')
    search_fields = ('donor_name',)

@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'amount', 'date')
    list_filter = ('category',)
    search_fields = ('title', 'paid_to')
